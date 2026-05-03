import { useState, useEffect } from "react";
import API_BASE from "../config";
import { Zap, ShieldCheck, Heart, ArrowRight, CheckCircle2, Loader2, Landmark, QrCode, Clock } from "lucide-react";
import { createPortal } from "react-dom";

function RechargeHub() {
  const [, setLoading] = useState(false);
  const [masterPayment, setMasterPayment] = useState(null);
  const [history, setHistory] = useState([]);
  
  // Payment Submission Modal State
  const [selectedPack, setSelectedPack] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [successDialog, setSuccessDialog] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
     try {
        const pRes = await fetch(`${API_BASE}/api/whatsapp/payment-info`, {
           headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        if (pRes.ok) setMasterPayment(await pRes.json());

        const hRes = await fetch(`${API_BASE}/api/whatsapp/recharge-history`, {
           headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        if (hRes.ok) setHistory(await hRes.json());
     } catch (e) {}
  };

  const packs = [
    { id: 1, credits: 5000, price: 499, title: "Starter", desc: "Small list testing" },
    { id: 2, credits: 20000, price: 1499, title: "Growth", desc: "Active marketing", popular: true },
    { id: 3, credits: 70000, price: 5999, title: "Enterprise", desc: "Huge campaigns" },
  ];

  const handleOpenPaymentModal = (pack) => {
    if (!masterPayment || (!masterPayment.upi && !masterPayment.bank)) {
        alert("Payment Gateway is currently offline. Please contact support.");
        return;
    }
    setSelectedPack(pack);
    setTransactionId("");
    setIsPaymentModalOpen(true);
  };

  const handleSubmitRecharge = async (e) => {
    e.preventDefault();
    if (!transactionId.trim()) return;
    
    setSubmitLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/whatsapp/recharge`, {
        method: 'POST',
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ 
           planAmount: selectedPack.price,
           credits: selectedPack.credits,
           transactionId: transactionId.trim()
        })
      });
      if (res.ok) {
        setIsPaymentModalOpen(false);
        setSuccessDialog(`Your request for ${selectedPack.credits} credits has been submitted successfully! Once the admin verifies the payment, credits will reflect in your wallet.`);
        fetchData();
      } else {
        const errType = await res.json();
        alert(errType.error || 'Failed to submit request');
      }
    } catch (err) { 
        console.error(err); 
        alert("Network Error");
    } finally { 
        setSubmitLoading(false); 
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] p-6 space-y-8 overflow-hidden">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
             <Zap className="w-8 h-8 text-amber-500 fill-amber-500" /> WhatsApp Credit Hub
          </h2>
          <p className="text-slate-500 font-medium text-sm mt-1 text-center sm:text-left">One credit = One message sent to a customer. No hidden fees.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1 overflow-y-auto custom-scrollbar pb-10">
         {packs.map((pack) => (
            <div key={pack.id} className={`bg-white border-2 rounded-[3.5rem] p-10 flex flex-col items-center relative transition-all hover:-translate-y-2 hover:shadow-2xl ${pack.popular ? 'border-indigo-600 shadow-xl shadow-indigo-100' : 'border-slate-100 shadow-sm'}`}>
               {pack.popular && (
                  <div className="absolute top-0 -translate-y-1/2 bg-indigo-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                     Best Seller
                  </div>
               )}
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">{pack.title}</p>
               <h3 className="text-5xl font-black text-slate-800 tracking-tighter mb-2">{pack.credits}</h3>
               <p className="text-slate-500 font-bold text-xs uppercase mb-10 tracking-widest">Broadcast Credits</p>
               
               <div className="flex items-end gap-1 mb-10">
                  <span className="text-slate-400 font-bold text-lg">₹</span>
                  <span className="text-4xl font-black text-slate-800 tracking-tighter">{pack.price}</span>
               </div>

               <div className="w-full space-y-4 mb-10">
                  <div className="flex items-center gap-3">
                     <div className="w-5 h-5 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center"><CheckCircle2 className="w-3 h-3" /></div>
                     <span className="text-xs font-bold text-slate-500">{pack.desc}</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-5 h-5 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center"><CheckCircle2 className="w-3 h-3" /></div>
                     <span className="text-xs font-bold text-slate-500">Official Meta Gateway</span>
                  </div>
               </div>

               <button 
                  disabled={_loading}
                  onClick={() => handleOpenPaymentModal(pack)}
                  className={`mt-auto w-full py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95 ${pack.popular ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-slate-900 hover:bg-black text-white'}`}
               >
                  Procure Now <ArrowRight className="w-4 h-4" />
               </button>
            </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
         <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 flex items-center gap-6 shadow-sm">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center shrink-0">
               <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="flex-1">
               <h4 className="font-black text-slate-800 tracking-tight uppercase text-xs mb-1">Secure Transactions</h4>
               <p className="text-[11px] text-slate-400 font-medium leading-relaxed">Transactions are handled via official Meta billing logic. You only pay for what you use.</p>
            </div>
            <Heart className="w-6 h-6 text-rose-300" />
         </div>

         {masterPayment && (masterPayment.upi || masterPayment.bank) && (
            <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white shadow-2xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5"><QrCode className="w-32 h-32" /></div>
               <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                  <Landmark className="w-8 h-8 text-indigo-300" />
               </div>
               <div className="flex-1">
                  <h4 className="font-black text-xs uppercase tracking-widest text-indigo-300 mb-2">Manual Bank / UPI Transfer</h4>
                  <div className="space-y-1">
                     {masterPayment.upi && <p className="text-sm font-black">UPI: <span className="text-indigo-200">{masterPayment.upi}</span></p>}
                     {masterPayment.bank && <p className="text-[10px] font-bold opacity-80">{masterPayment.bank} {masterPayment.ifsc && `| IFSC: ${masterPayment.ifsc}`}</p>}
                  </div>
               </div>
            </div>
         )}
      </div>

      {/* Recharge History */}
      <div className="bg-white border rounded-[2.5rem] p-8 shadow-sm">
         <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-indigo-500" /> Recharge History
         </h3>
         {history.length === 0 ? (
            <p className="text-slate-400 font-bold text-center py-10">No past transactions found.</p>
         ) : (
            <div className="space-y-4">
               {history.map(req => (
                  <div key={req.id} className="bg-slate-50 border p-5 rounded-2xl flex items-center justify-between">
                     <div>
                        <p className="font-black text-slate-800">{req.credits_requested.toLocaleString()} Credits</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">₹{req.plan_amount} • {new Date(req.created_at).toLocaleDateString()}</p>
                     </div>
                     <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${req.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : req.status === 'REJECTED' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                        {req.status}
                     </span>
                  </div>
               ))}
            </div>
         )}
      </div>

      {/* Payment Modal */}
      {isPaymentModalOpen && selectedPack && createPortal(
         <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !submitLoading && setIsPaymentModalOpen(false)} />
            <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl p-8 overflow-hidden animate-in zoom-in-95 duration-200">
               <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Recharge Wallet</h3>
               <p className="text-sm font-bold text-slate-500 mb-8">You are purchasing <span className="text-indigo-600">{selectedPack.credits.toLocaleString()} Credits</span> for <span className="text-indigo-600">₹{selectedPack.price}</span>.</p>
               
               <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8 space-y-4 text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Transfer to Official Account</p>
                  
                  {/* Premium Merchant Standee UI wrapper around the QR Code */}
                  {(masterPayment?.qr_code_url || masterPayment?.upi) && (
                     <div className="flex justify-center mb-6 mt-4">
                        <div className="relative bg-white border border-slate-200 shadow-2xl rounded-[2rem] p-6 pb-5 inline-flex flex-col items-center">
                           <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-t-[2rem]"></div>
                           <div className="mb-5 mt-2">
                              <p className="font-black text-slate-900 text-lg uppercase tracking-tight flex items-center justify-center gap-2">
                                 <Zap className="w-5 h-5 text-amber-500" /> UPI PAYMENT
                              </p>
                              <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-1">Scan & Pay to Recharge</p>
                           </div>
                           <div className="bg-white p-2 rounded-2xl border-2 border-dashed border-slate-200 shadow-inner">
                              <img 
                                 src={masterPayment?.qr_code_url ? masterPayment.qr_code_url : `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${masterPayment.upi}&pn=SaSLoop%20Credits`} 
                                 alt="UPI QR Code" 
                                 className="w-48 h-48 object-cover rounded-xl" 
                                 onError={(e) => e.target.style.display='none'} 
                              />
                           </div>
                           <div className="mt-6 flex flex-col items-center gap-2 w-full border-t border-slate-100 pt-4">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Supported Payment Apps</p>
                              <div className="flex gap-2 items-center justify-center">
                                 <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-xl shadow-sm">GPay</span>
                                 <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-xl shadow-sm">PhonePe</span>
                                 <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-xl shadow-sm">Paytm</span>
                                 <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-xl shadow-sm">BHIM</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  )}

                  {masterPayment?.upi && (
                     <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl inline-block w-full">
                        <p className="text-[10px] text-indigo-400 font-bold uppercase mb-1">UPI ID</p>
                        <p className="text-base font-black text-indigo-700 break-all">{masterPayment.upi}</p>
                     </div>
                  )}
                  {masterPayment?.bank && (
                     <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl inline-block w-full">
                        <p className="text-[10px] text-indigo-400 font-bold uppercase mb-1">Bank Account</p>
                        <p className="text-base font-black text-indigo-700 break-all">{masterPayment.bank}</p>
                        {masterPayment.ifsc && <p className="text-[10px] text-indigo-500/60 font-bold tracking-widest mt-1">IFSC: {masterPayment.ifsc}</p>}
                     </div>
                  )}
               </div>

               <form onSubmit={handleSubmitRecharge}>
                  <div className="mb-8">
                     <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-2">Provide UTR / Transaction ID</label>
                     <input 
                        type="text" 
                        required 
                        value={transactionId} 
                        onChange={e => setTransactionId(e.target.value)} 
                        placeholder="e.g. 312345678901..." 
                        className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl font-mono text-sm outline-none focus:border-indigo-500 transition-all font-bold text-slate-800"
                     />
                  </div>
                  <div className="flex gap-4">
                     <button type="button" disabled={submitLoading} onClick={() => setIsPaymentModalOpen(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-500 font-black uppercase text-xs tracking-widest rounded-2xl py-4 transition-all">Cancel</button>
                     <button type="submit" disabled={submitLoading || !transactionId} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-xs tracking-widest rounded-2xl py-4 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2">
                        {submitLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Request"}
                     </button>
                  </div>
               </form>
            </div>
         </div>
      , document.body)}

      {successDialog && createPortal(
         <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-emerald-900/40 backdrop-blur-sm" onClick={() => setSuccessDialog(null)} />
            <div className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl p-8 text-center animate-in zoom-in-95 duration-200">
               <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10" />
               </div>
               <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-4">Request Sent!</h3>
               <p className="text-sm font-bold text-slate-500 mb-8 leading-relaxed">{successDialog}</p>
               <button onClick={() => setSuccessDialog(null)} className="w-full bg-slate-900 hover:bg-black text-white font-black uppercase text-xs tracking-widest rounded-2xl py-5 transition-all">Got It</button>
            </div>
         </div>
      , document.body)}

    </div>
  );
}

export default RechargeHub;
