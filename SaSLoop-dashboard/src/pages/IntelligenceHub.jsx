import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, Bot, TrendingUp, Users, AlertCircle, 
  ArrowRight, MessageSquare, Zap, Target, 
  Brain, BarChart3, PieChart, Activity, Send, Mic, Volume2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API_BASE from "../config";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell
} from "recharts";

const IntelligenceHub = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Welcome to SaSLoop Brain. I've analyzed your data from the last 30 days. How can I help you grow today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState("insights"); // insights, marketing, loyalty
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (window.webkitSpeechRecognition || window.SpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/ai/consultant`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ prompt: input })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || "I'm processing your request..." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I encountered an error analyzing your data. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const insights = [
    { title: "Peak Demand Alert", desc: "Order volume usually spikes by 40% on Friday nights. Ensure staff is ready.", icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
    { title: "Churn Risk", desc: "12 VIP customers haven't ordered in 14 days. Recommend a 'We Miss You' campaign.", icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-50" },
    { title: "Trending Item", desc: "Latte sales are up 25%. Consider adding a 'Latte Art' special.", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
  ];

  const chartData = [
    { name: 'Mon', sales: 4000, revenue: 2400 },
    { name: 'Tue', sales: 3000, revenue: 1398 },
    { name: 'Wed', sales: 2000, revenue: 9800 },
    { name: 'Thu', sales: 2780, revenue: 3908 },
    { name: 'Fri', sales: 1890, revenue: 4800 },
    { name: 'Sat', sales: 2390, revenue: 3800 },
    { name: 'Sun', sales: 3490, revenue: 4300 },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic flex items-center gap-3">
            <Brain className="w-10 h-10 text-indigo-600" /> SaSLoop Brain
          </h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">Predictive Business Intelligence • AI Powered</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
           {['insights', 'marketing', 'loyalty'].map(t => (
             <button 
               key={t}
               onClick={() => setActiveTab(t)}
               className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
             >
               {t}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: CHAT INTERFACE */}
        <div className="lg:col-span-4 flex flex-col h-[700px] bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
          <div className="p-8 border-b border-slate-50 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-widest">AI Consultant</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400 opacity-80">Live Data Sync</span>
                </div>
              </div>
            </div>
            <Volume2 className="w-5 h-5 text-slate-400 cursor-pointer hover:text-white transition-colors" />
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
            {messages.map((m, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={i} 
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] p-5 rounded-3xl text-sm font-medium leading-relaxed ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-50 text-slate-700 rounded-bl-none border border-slate-100'}`}>
                  {m.content}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-50 p-4 rounded-3xl rounded-bl-none border border-slate-100 flex gap-1">
                  <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" />
                  <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce delay-100" />
                  <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-8 bg-slate-50/50 border-t border-slate-100">
            <div className="relative group">
              <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask your AI consultant..."
                className="w-full bg-white border border-slate-200 rounded-2xl pl-6 pr-24 py-5 text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button 
                  onClick={toggleListening}
                  className={`p-2 transition-colors ${isListening ? 'text-rose-500 animate-pulse' : 'text-slate-400 hover:text-indigo-600'}`}
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleSend}
                  className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-lg shadow-indigo-100 hover:scale-105 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: VISUALIZATIONS & INSIGHTS */}
        <div className="lg:col-span-8 space-y-8">
          {/* TOP INSIGHTS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {insights.map((insight, i) => (
              <motion.div 
                whileHover={{ y: -5 }}
                key={i} 
                className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-start gap-6 group hover:shadow-xl transition-all"
              >
                <div className={`w-14 h-14 ${insight.bg} ${insight.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <insight.icon className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 tracking-tight text-lg mb-2">{insight.title}</h4>
                  <p className="text-slate-500 text-xs font-bold leading-relaxed">{insight.desc}</p>
                </div>
                <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-indigo-600 group-hover:gap-3 transition-all">
                  Take Action <ArrowRight className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* MAIN VISUALIZATION */}
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 h-[450px] relative overflow-hidden">
             <div className="flex justify-between items-center mb-10">
               <div>
                  <h3 className="font-black text-xl text-slate-900 tracking-tighter">Revenue Intelligence</h3>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Comparing Gross Sales vs Net Profit</p>
               </div>
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 bg-indigo-500 rounded-full" /><span className="text-[9px] font-black uppercase text-slate-400">Sales</span></div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-400 rounded-full" /><span className="text-[9px] font-black uppercase text-slate-400">Net Profit</span></div>
               </div>
             </div>
             <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} dy={10} />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '20px' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* BOTTOM QUICK STATS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900 p-10 rounded-[3rem] text-white flex items-center justify-between group overflow-hidden relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all" />
               <div className="relative z-10">
                  <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Loyalty Strength</p>
                  <h3 className="text-5xl font-black tracking-tighter italic">84.2%</h3>
                  <p className="text-slate-400 text-xs font-bold mt-2">Retention is up 12% this month</p>
               </div>
               <div className="relative z-10 p-6 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-xl">
                  <Users className="w-10 h-10 text-indigo-400" />
               </div>
            </div>
            
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 flex items-center justify-between group">
               <div>
                  <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Ad Efficiency</p>
                  <h3 className="text-5xl font-black tracking-tighter italic text-slate-900">4.8x</h3>
                  <p className="text-slate-400 text-xs font-bold mt-2">ROAS for WhatsApp campaigns</p>
               </div>
               <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100">
                  <Target className="w-10 h-10 text-emerald-500" />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelligenceHub;
