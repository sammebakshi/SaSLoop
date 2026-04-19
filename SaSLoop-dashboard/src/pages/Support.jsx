import { useEffect, useState } from "react";
import API_BASE from "../config";
import { HelpCircle, Send, Clock, MessageSquare, CheckCircle2, ChevronRight, AlertCircle, LifeBuoy } from "lucide-react";

function Support() {
  const [tickets, setTickets] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("create");

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const fetchMyTickets = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/support/my`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      const res = await fetch(`${API_BASE}/api/support`, {
        method: 'POST',
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ subject, message })
      });
      if (res.ok) {
        setSubject("");
        setMessage("");
        setSuccess(true);
        fetchMyTickets();
        setTimeout(() => setActiveTab("history"), 1500);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] p-6 space-y-6 overflow-hidden">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
             <LifeBuoy className="w-8 h-8 text-indigo-500" /> Help & Support
          </h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Get assistance from our dedicated support team.</p>
        </div>
      </div>

      <div className="flex bg-white border border-slate-200 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] flex-1 overflow-hidden relative">
        {/* Navigation Sidebar */}
        <div className="w-[300px] bg-slate-50 border-r border-slate-200 p-8 space-y-2">
           <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-6 pl-2">Assistance Hub</p>
           <button 
              onClick={() => setActiveTab("create")}
              className={`w-full p-4 rounded-2xl text-left flex items-center gap-3 transition-all ${activeTab === 'create' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'bg-white border border-slate-100 text-slate-500 hover:border-slate-300'}`}
           >
              <HelpCircle className="w-4 h-4" />
              <span className="font-bold text-xs">Create Ticket</span>
           </button>
           <button 
              onClick={() => setActiveTab("history")}
              className={`w-full p-4 rounded-2xl text-left flex items-center gap-3 transition-all ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'bg-white border border-slate-100 text-slate-500 hover:border-slate-300'}`}
           >
              <Clock className="w-4 h-4" />
              <span className="font-bold text-xs">Ticket History</span>
              <span className={`ml-auto text-[10px] font-black px-2 py-0.5 rounded-full ${activeTab === 'history' ? 'bg-white/20' : 'bg-slate-200 text-slate-600'}`}>{tickets.length}</span>
           </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
           {activeTab === 'create' ? (
              <div className="max-w-xl animate-in fade-in slide-in-from-right-4 duration-500">
                 <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-8">Open a Support Request</h3>
                 <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="group">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 block">Subject</label>
                       <input 
                          required 
                          placeholder="e.g. Broadcast credits not appearing"
                          value={subject}
                          onChange={e => setSubject(e.target.value)}
                          className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 font-bold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-sm"
                       />
                    </div>
                    <div className="group">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 block">Detailed Problem Description</label>
                       <textarea 
                          required 
                          rows={6}
                          placeholder="Please provide as much detail as possible..."
                          value={message}
                          onChange={e => setMessage(e.target.value)}
                          className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 font-bold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-sm resize-none"
                       />
                    </div>
                    <button 
                       disabled={loading}
                       type="submit"
                       className="w-full bg-slate-900 border-2 border-slate-900 hover:bg-black text-white font-black py-5 rounded-2xl text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 disabled:opacity-50"
                    >
                       {loading ? 'Transmitting...' : 'Submit Request 🚀'}
                    </button>
                    {success && (
                       <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3 animate-in zoom-in duration-300">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          <p className="text-sm font-bold text-emerald-600">Ticket submitted. Switching to history view...</p>
                       </div>
                    )}
                 </form>
              </div>
           ) : (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
                 <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-8">My Inquiries</h3>
                 {tickets.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center opacity-30">
                       <MessageSquare className="w-12 h-12 mb-4" />
                       <p className="font-black uppercase tracking-widest text-slate-400">No active tickets</p>
                    </div>
                 ) : (
                    <div className="space-y-4">
                       {tickets.map(t => (
                          <div key={t.id} className="bg-white border-2 border-slate-100 rounded-3xl p-6 hover:border-indigo-500/30 transition-all shadow-sm relative overflow-hidden">
                             <div className="flex justify-between items-start mb-4">
                                <div>
                                   <div className="flex items-center gap-3 mb-1">
                                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg ${t.status === 'open' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>{t.status}</span>
                                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Ref: #{t.id.toString().padStart(4,'0')}</span>
                                   </div>
                                   <h4 className="font-black text-slate-800 tracking-tight">{t.subject}</h4>
                                </div>
                                <span className="text-[10px] text-slate-400 font-bold">{new Date(t.created_at).toLocaleDateString()}</span>
                             </div>
                             <p className="text-xs text-slate-500 mb-6 font-medium leading-relaxed">{t.message}</p>
                             
                             {t.admin_reply && (
                                <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100/50">
                                   <div className="flex items-center gap-2 mb-2 text-indigo-500">
                                      <LifeBuoy className="w-3.5 h-3.5" />
                                      <span className="text-[10px] font-black uppercase tracking-widest">Support Response</span>
                                   </div>
                                   <p className="text-xs text-slate-700 font-bold leading-relaxed">{t.admin_reply}</p>
                                </div>
                             )}
                          </div>
                       ))}
                    </div>
                 )}
              </div>
           )}
        </div>
      </div>
    </div>
  );
}

export default Support;
