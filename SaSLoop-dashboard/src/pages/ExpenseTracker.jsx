import React, { useState, useEffect, useMemo } from "react";
import { 
  Plus, Trash2, Search, Filter, Calendar, CreditCard, 
  ArrowUpRight, ArrowDownRight, Wallet, PieChart, Info,
  TrendingUp, TrendingDown, IndianRupee
} from "lucide-react";
import API_BASE, { isMobileDevice } from "../config";

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const isMobile = isMobileDevice();

  const [formData, setFormData] = useState({
    category: "Vegetables",
    amount: "",
    note: "",
    expense_date: new Date().toISOString().split('T')[0]
  });

  const categories = [
    "Vegetables", "Grocery", "Dairy", "Meat", "Rent", 
    "Electricity", "Water", "Gas", "Staff Salary", 
    "Maintenance", "Marketing", "Others"
  ];

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/business/expenses`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setExpenses(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchExpenses(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/business/expenses`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowAddForm(false);
        setFormData({ ...formData, amount: "", note: "" });
        fetchExpenses();
      }
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense record?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE}/api/business/expenses/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      fetchExpenses();
    } catch (e) { console.error(e); }
  };

  const totals = useMemo(() => {
    const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const byCategory = {};
    expenses.forEach(e => {
      byCategory[e.category] = (byCategory[e.category] || 0) + parseFloat(e.amount);
    });
    return { total, byCategory };
  }, [expenses]);

  if (loading) return <div className="h-full flex items-center justify-center p-20 animate-pulse text-slate-400 font-black uppercase text-xs">Loading Ledger...</div>;

  return (
    <div className={`max-w-[1280px] mx-auto w-full pt-4 pb-20 ${isMobile ? 'px-4' : 'px-6'}`}>
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-4">
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic underline decoration-rose-500">
             Business Ledger
          </h2>
          <p className="text-slate-500 text-sm font-bold opacity-50 uppercase tracking-widest mt-1">Track daily costs and overheads</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className={`px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl ${showAddForm ? 'bg-slate-100 text-slate-600' : 'bg-rose-500 text-white shadow-rose-200'}`}
        >
          {showAddForm ? 'Cancel' : <><Plus className="w-4 h-4 inline mr-2" /> Record Expense</>}
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform"><TrendingDown className="w-20 h-20" /></div>
             <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Total Outflow</p>
             <h3 className="text-5xl font-black tracking-tighter italic">₹{totals.total.toLocaleString()}</h3>
             <div className="mt-4 flex items-center gap-2 text-rose-400 text-[10px] font-black uppercase">
                <ArrowUpRight className="w-4 h-4" /> Updated just now
             </div>
          </div>
          <div className="bg-white border-2 border-slate-50 rounded-[2.5rem] p-8 shadow-sm group">
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Highest Category</p>
             <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                {Object.keys(totals.byCategory).sort((a,b) => totals.byCategory[b] - totals.byCategory[a])[0] || 'N/A'}
             </h3>
             <p className="text-slate-400 text-[10px] font-bold mt-1 uppercase">Dominating your costs</p>
          </div>
          <div className="bg-white border-2 border-slate-50 rounded-[2.5rem] p-8 shadow-sm">
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Daily Average</p>
             <h3 className="text-3xl font-black text-slate-900 tracking-tight">₹{(totals.total / Math.max(1, expenses.length)).toFixed(0)}</h3>
             <p className="text-slate-400 text-[10px] font-bold mt-1 uppercase">Per record average</p>
          </div>
      </div>

      <div className="flex flex-col gap-8">
        
        {/* ADD FORM */}
        {showAddForm && (
          <div className="bg-white rounded-[3rem] border-2 border-rose-100 p-10 shadow-2xl animate-in slide-in-from-top duration-300">
             <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                   <select 
                     value={formData.category} 
                     onChange={e => setFormData({...formData, category: e.target.value})}
                     className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-xs font-bold focus:ring-2 ring-rose-500/20"
                   >
                     {categories.map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Amount (₹)</label>
                   <input 
                     type="number" required placeholder="0.00"
                     value={formData.amount} 
                     onChange={e => setFormData({...formData, amount: e.target.value})}
                     className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-xs font-bold"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                   <input 
                     type="date"
                     value={formData.expense_date} 
                     onChange={e => setFormData({...formData, expense_date: e.target.value})}
                     className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-xs font-bold"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Note / Description</label>
                   <input 
                     type="text" placeholder="e.g. Weekly veg purchase"
                     value={formData.note} 
                     onChange={e => setFormData({...formData, note: e.target.value})}
                     className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-xs font-bold"
                   />
                </div>
                <div className="col-span-full pt-4">
                   <button type="submit" className="w-full py-5 bg-rose-500 text-white rounded-[2rem] font-black text-[12px] uppercase shadow-xl shadow-rose-100 hover:bg-rose-600 transition-all active:scale-95">Save record to ledger</button>
                </div>
             </form>
          </div>
        )}

        {/* LIST */}
        <div className="bg-white rounded-[3rem] border-2 border-slate-50 shadow-2xl shadow-slate-200/40 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Recent Transactions</h3>
               <div className="flex gap-4">
                  <div className="relative">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                     <input type="text" placeholder="Search notes..." className="bg-white border border-slate-100 rounded-xl pl-12 pr-4 py-3 text-[10px] font-bold outline-none w-48 focus:border-rose-300" />
                  </div>
               </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="bg-slate-50/50">
                         <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                         <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                         <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Note</th>
                         <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                         <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {expenses.map(exp => (
                        <tr key={exp.id} className="hover:bg-slate-50/30 group transition-all">
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                 <Calendar className="w-4 h-4 text-slate-300" />
                                 <span className="text-xs font-bold text-slate-600">{new Date(exp.expense_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <span className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest">{exp.category}</span>
                           </td>
                           <td className="px-8 py-6">
                              <p className="text-xs font-bold text-slate-800 line-clamp-1">{exp.note || '—'}</p>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <span className="text-sm font-black text-rose-500 italic">₹{parseFloat(exp.amount).toFixed(0)}</span>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <button 
                                onClick={() => handleDelete(exp.id)}
                                className="p-2.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                              >
                                 <Trash2 className="w-4 h-4" />
                              </button>
                           </td>
                        </tr>
                      ))}
                      {expenses.length === 0 && (
                        <tr>
                           <td colSpan="5" className="px-8 py-20 text-center">
                              <div className="flex flex-col items-center opacity-20">
                                 <Wallet className="w-16 h-16 mb-4" />
                                 <p className="text-[10px] font-black uppercase tracking-[0.3em]">No records found</p>
                              </div>
                           </td>
                        </tr>
                      )}
                   </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;
