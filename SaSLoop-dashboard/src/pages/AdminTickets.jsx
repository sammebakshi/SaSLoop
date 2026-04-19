import { useEffect, useState } from "react";
import API_BASE from "../config";
import { LifeBuoy, User, Clock, MessageSquare, CheckCircle2, ChevronRight, AlertCircle, Send, X, Building2 } from "lucide-react";
import { createPortal } from "react-dom";

function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/support/all`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleReply = async () => {
    if (!replyText.trim() || !selectedTicket) return;
    try {
      const res = await fetch(`${API_BASE}/api/support/${selectedTicket.id}/reply`, {
        method: 'PUT',
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ reply: replyText, status: 'resolved' })
      });
      if (res.ok) {
        setIsReplyModalOpen(false);
        setReplyText("");
        fetchTickets();
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] p-6 space-y-6 overflow-hidden">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
             <MessageSquare className="w-8 h-8 text-indigo-500" /> Support Desk
          </h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Global oversight of customer help inquiries and system feedback.</p>
        </div>
        <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm text-xs font-bold text-slate-400">
           Total Issues: {tickets.length}
        </div>
      </div>

      <div className="flex bg-white border border-slate-200 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] flex-1 overflow-hidden relative">
        <div className="flex-1 overflow-auto custom-scrollbar p-10">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tickets.map(t => (
                <div key={t.id} className="bg-white border-2 border-slate-100 rounded-[2rem] p-6 hover:shadow-xl transition-all relative overflow-hidden flex flex-col group">
                   <div className="flex justify-between items-start mb-6">
                      <div className={`p-3 rounded-2xl ${t.status === 'open' ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'}`}>
                         <LifeBuoy className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${t.status === 'open' ? 'text-amber-500' : 'text-emerald-500'}`}>{t.status}</span>
                   </div>

                   <div className="mb-4">
                      <h4 className="font-black text-slate-800 tracking-tight leading-none mb-1">{t.subject}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">REF: #{t.id.toString().padStart(4,'0')}</p>
                   </div>

                   <p className="text-xs text-slate-500 mb-6 font-medium line-clamp-3">{t.message}</p>

                   <div className="mt-auto space-y-4 pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                            <User className="w-4 h-4" />
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight">{t.username}</p>
                            <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold">
                               <Building2 className="w-3 h-3" /> {t.business_name || 'N/A'}
                            </div>
                         </div>
                      </div>
                      <button 
                        onClick={() => { setSelectedTicket(t); setIsReplyModalOpen(true); }}
                        className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${t.status === 'open' ? 'bg-slate-900 hover:bg-black text-white' : 'bg-slate-100 text-slate-400 cursor-default'}`}
                      >
                         {t.status === 'open' ? 'Resolve Inquiry' : 'Already Resolved'}
                      </button>
                   </div>
                </div>
              ))}
              {tickets.length === 0 && !loading && (
                <div className="col-span-full py-20 flex flex-col items-center justify-center opacity-30">
                   <CheckCircle2 className="w-16 h-16 mb-4" />
                   <p className="font-black uppercase tracking-widest text-slate-400">No pending inquiries</p>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* REPLY MODAL */}
      {isReplyModalOpen && selectedTicket && createPortal(
         <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsReplyModalOpen(false)} />
            <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 p-10">
               <div className="flex justify-between items-center mb-10">
                  <div>
                     <h3 className="text-2xl font-black text-slate-800 tracking-tight">Resolution Portal</h3>
                     <p className="text-slate-400 font-medium text-xs mt-1">Issue: {selectedTicket.subject}</p>
                  </div>
                  <button onClick={() => setIsReplyModalOpen(false)} className="text-slate-400 hover:text-slate-900"><X className="w-6 h-6" /></button>
               </div>

               <div className="bg-slate-50 border border-slate-100 p-6 rounded-[1.5rem] mb-8">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Customer Query</p>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">{selectedTicket.message}</p>
               </div>

               <div className="space-y-6">
                  <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 block">Your Official Reply</label>
                     <textarea 
                        rows={5}
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="Explain the resolution or ask for more info..."
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 font-bold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-sm resize-none"
                     />
                  </div>
                  <button 
                     onClick={handleReply}
                     className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-2xl text-[11px] uppercase tracking-widest transition-all shadow-xl active:scale-95"
                  >
                     Send Reply & Mark as Resolved
                  </button>
               </div>
            </div>
         </div>
      , document.body)}
    </div>
  );
}

export default AdminTickets;
