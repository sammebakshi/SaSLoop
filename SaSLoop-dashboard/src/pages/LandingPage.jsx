import { useState, useEffect } from "react";
import API_BASE from "../config";
import { 
  ArrowRight, Bot, Zap, Globe, Smartphone, BarChart3, 
  CheckCircle2, MessageSquare, ShieldCheck, ShoppingBag, Users, PhoneCall,
  Mail, Lock, Building2, EyeOff, Eye, ChevronDown, Infinity, AlertCircle, Heart, Award, TrendingUp, Download, Share2, X
} from 'lucide-react';

const SaSLoopLogo = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]">
    <defs>
      <linearGradient id="waGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4ade80" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <linearGradient id="loopGradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#a78bfa" />
        <stop offset="50%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#34d399" />
      </linearGradient>
    </defs>
    <path d="M 18,50 C 18,30 32,16 50,16 C 68,16 82,30 82,50 C 82,70 68,84 50,84 C 44,84 38,82 34,79 L 18,84 L 22,70 C 19.5,64 18,57 18,50 Z" 
          stroke="url(#waGradient)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="rgba(16,185,129,0.05)" />
    <path d="M 36 50 C 36 40, 48 40, 50 50 C 52 60, 64 60, 64 50 C 64 40, 52 40, 50 50 C 48 60, 36 60, 36 50 Z" 
          stroke="url(#loopGradient)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" className="animate-[pulse_2s_ease-in-out_infinite]" />
  </svg>
);

const TypewriterText = () => {
  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  
  const features = [
    "WhatsApp Automation",
    "Smart Lead Generation",
    "Instant Auto Replies",
    "Automated Order Tracking",
    "Multi-Agent Support"
  ];

  useEffect(() => {
    let timer;
    const currentText = features[textIndex];
    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayText(currentText.substring(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % features.length);
        }
      }, 50);
    } else {
      timer = setTimeout(() => {
        setDisplayText(currentText.substring(0, displayText.length + 1));
        if (displayText.length === currentText.length) {
          timer = setTimeout(() => setIsDeleting(true), 2000);
        }
      }, 80);
    }
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, textIndex]);

  return (
    <span className="text-emerald-400 font-mono">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

const CONVERSATIONS = [
  { c: "Hi, I'd like to schedule a viewing for the downtown apartment.", r: "Great! We have slots open tomorrow at 10 AM and 2 PM. Which works best for you? 🏢" },
  { c: "My package hasn't arrived yet!", r: "Let me check... Your package is out for delivery and will arrive by 4 PM. 📦" },
  { c: "Is the summer discount still active?", r: "Yes! Use code SUMMER20 to get 20% off all subscriptions until tomorrow! ☀️" },
  { c: "Can you resend the invoice for last month's consultation?", r: "Certainly! I've sent the PDF to your email. Would you like a secure link to pay now? 📄" },
  { c: "¿Tienen soporte en español?", r: "¡Sí! Nuestro sistema detecta el idioma. ¿En qué le puedo ayudar? 🌎" },
  { c: "Need to reschedule my 3PM call.", r: "No problem. I've sent you a link to pick a new time from the calendar. 📅" },
  { c: "How do I upgrade to the enterprise tier?", r: "I can help with that! Let me connect you with our technical sales team. 💼" },
  { c: "Where can I find your developer API documents?", r: "Our core API documentation is available at developer.sasloop.ai. 💻" }
];

const ChatAnimationBackground = () => {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    let bubbleId = 0;
    const spawnBubble = () => {
      const regions = [
        { left: '4%', top: '12%' }, { left: '8%', top: '65%' }, { right: '6%', top: '10%' },
        { right: '10%', top: '62%' }, { left: '6%', top: '38%' }, { right: '8%', top: '35%' }
      ];
      const region = regions[Math.floor(Math.random() * regions.length)];
      const jX = Math.floor(Math.random() * 8) - 4;
      const jY = Math.floor(Math.random() * 8) - 4;
      const pos = {};
      if (region.left) pos.left = `calc(${region.left} + ${jX}%)`;
      if (region.right) pos.right = `calc(${region.right} + ${jX}%)`;
      if (region.top) pos.top = `calc(${region.top} + ${jY}%)`;

      return {
        id: ++bubbleId,
        pos,
        convo: CONVERSATIONS[Math.floor(Math.random() * CONVERSATIONS.length)],
        createdAt: Date.now()
      };
    };
    setBubbles([spawnBubble()]);
    const interval = setInterval(() => {
      setBubbles(prev => {
        const now = Date.now();
        const alive = prev.filter(b => now - b.createdAt < 14000);
        return [...alive, spawnBubble()];
      });
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-slate-900 pointer-events-none opacity-40">
      <style>{`
        @keyframes dynamicFade {
          0% { opacity: 0; transform: translateY(20px) scale(0.95); }
          10%, 85% { opacity: 1; transform: translateY(0) scale(1); }
          95%, 100% { opacity: 0; transform: translateY(-20px) scale(0.95); }
        }
        @keyframes dynamicFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .dyn-bubble-c1 { animation: dynamicFade 14s ease-in-out forwards, dynamicFloat 4s ease-in-out infinite; }
        .dyn-bubble-c2 { animation: dynamicFade 12.8s ease-in-out forwards, dynamicFloat 5s ease-in-out infinite; }
      `}</style>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black opacity-90"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full max-w-7xl h-full hidden lg:block">
          {bubbles.map((b) => (
              <div key={b.id} style={{...b.pos, position: 'absolute', zIndex: b.id}}>
                <div className="max-w-[260px] w-full p-4 rounded-2xl rounded-bl-sm bg-slate-800/80 border border-slate-700/50 backdrop-blur-md shadow-2xl dyn-bubble-c1 opacity-0">
                  <div className="text-[10px] text-slate-400 mb-1 font-semibold uppercase tracking-wider">Customer</div>
                  <div className="text-sm text-slate-200">{b.convo.c}</div>
                </div>
                <div className="absolute top-[80%] left-4 max-w-[300px] w-[300px] p-4 rounded-2xl rounded-tl-sm bg-emerald-900/40 border border-emerald-500/30 backdrop-blur-md shadow-2xl dyn-bubble-c2 opacity-0" style={{ animationDelay: '1.2s' }}>
                  <div className="flex items-center gap-2 text-[10px] text-emerald-400 mb-1 font-semibold uppercase tracking-wider">SaS Loop AI</div>
                  <div className="text-sm text-slate-200">{b.convo.r}</div>
                </div>
              </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function LandingPage() {
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadContext, setLeadContext] = useState("");
  const [leadData, setLeadData] = useState({ name: "", phone: "", business: "", interest: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const openLeadForm = (context = "Demo") => {
    setLeadContext(context);
    setLeadData({ ...leadData, interest: context });
    setShowLeadForm(true);
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Send to backend lead endpoint
      const res = await fetch(`${API_BASE}/api/public/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData)
      });
      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setShowLeadForm(false);
          setIsSuccess(false);
          setLeadData({ name: "", phone: "", business: "", interest: "" });
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
    setIsSubmitting(false);
  };

  const features = [
    { title: "AI Ordering Agent", desc: "Automated WhatsApp bot that handles orders, catalog browsing, and support 24/7.", icon: Bot },
    { title: "Smart Inventory", desc: "Real-time stock tracking with automated low-stock alerts sent directly to your staff.", icon: Zap },
    { title: "Global Ready", desc: "Multi-currency support and localized WhatsApp messaging for any country in the world.", icon: Globe },
    { title: "Hybrid Intervention", desc: "Seamlessly pause the AI at any time to take over sensitive conversations manually.", icon: Smartphone },
    { title: "Campaign Engine", desc: "Launch viral WhatsApp broadcasts to your customer tribe with high-conversion tracking.", icon: BarChart3 },
    { title: "Loyalty & CRM", desc: "Integrated points system and feedback loop to keep your customers coming back.", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      
      {/* NAVIGATION */}
      <nav className="fixed top-0 inset-x-0 h-24 bg-white/80 backdrop-blur-xl z-50 border-b border-slate-100 flex items-center justify-between px-10 md:px-20">
         <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <SaSLoopLogo />
            <span className="text-2xl font-black tracking-tighter uppercase italic">SaSLoop</span>
         </div>
         <div className="hidden md:flex items-center gap-12 text-sm font-black uppercase tracking-widest text-slate-400">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
            <button onClick={() => openLeadForm("Live Demo")} className="hover:text-indigo-600 transition-colors uppercase font-black tracking-widest">Live Demo</button>
         </div>
         <a href="/login" onClick={(e) => {
            // Force clear stale session if clicking partner portal to ensure login page shows
            localStorage.removeItem("token");
            localStorage.removeItem("user");
         }} className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black hover:scale-105 transition-all shadow-xl active:scale-95">
            Partner Portal
         </a>
      </nav>

      {/* HERO SECTION */}
      <header className="pt-48 pb-32 px-10 md:px-20 text-center relative overflow-hidden bg-slate-900 text-white">
         <ChatAnimationBackground />
         <div className="relative z-10">
            <div className="inline-block px-4 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-500/20 mb-8">
               <TypewriterText />
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] mb-10 max-w-5xl mx-auto">
               Your Business on <span className="text-emerald-400">WhatsApp</span>, Powered by <span className="underline decoration-emerald-200 underline-offset-8">AI</span>
            </h1>
            <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
               Revolutionize your operations with an automated AI agent that sells, supports, and grows your tribe while you sleep. Built for the global enterprise.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
               <button onClick={() => openLeadForm("Free Trial")} className="w-full sm:w-auto px-10 py-5 bg-emerald-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-2xl shadow-emerald-900/50 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-3">
                  Start Your Free Trial <ArrowRight className="w-4 h-4" />
               </button>
               <button onClick={() => openLeadForm("Demo Booking")} className="w-full sm:w-auto px-10 py-5 bg-white/5 border-2 border-white/10 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3 backdrop-blur-lg">
                  Book a Demo <PhoneCall className="w-4 h-4" />
               </button>
            </div>
         </div>
      </header>

      {/* FEATURES GRID */}
      <section id="features" className="py-32 px-10 md:px-20 bg-slate-50/50">
         <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Hyper-Growth Infrastructure</h2>
            <p className="text-slate-400 font-bold uppercase text-[11px] tracking-[0.3em]">6 Pillars of the SaSLoop Ecosystem</p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((f, i) => (
               <div key={i} className="bg-white p-10 rounded-[3.5rem] shadow-sm hover:shadow-2xl transition-all border border-slate-100 group">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform group-hover:bg-emerald-600 group-hover:text-white">
                     <f.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-black mb-4 tracking-tight">{f.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
               </div>
            ))}
         </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-32 px-10 md:px-20 bg-white">
         <div className="text-center mb-24">
            <h2 className="text-5xl font-black tracking-tight mb-4 text-slate-900">Transparent Global Pricing</h2>
            <p className="text-slate-400 font-bold uppercase text-[11px] tracking-[0.3em] mb-4">No Hidden Fees • One Platform • Any Country</p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {[
              { title: "Starter", price: "49", target: "Single Outlets", features: ["1,000 AI Conversations", "Live Order Board", "Basic Inventory", "Multi-Language"] },
              { title: "Growth", price: "129", target: "Growing Brands", features: ["5,000 AI Conversations", "Loyalty & CRM", "Broadcast Hub", "Priority Support"], popular: true },
              { title: "Global", price: "299", target: "Enterprises", features: ["Unlimited AI", "Custom Knowledge Base", "API Integration", "Account Manager"] },
            ].map((p, i) => (
               <div key={i} className={`p-12 rounded-[3.5rem] border flex flex-col items-center text-center relative transition-all hover:-translate-y-2 ${p.popular ? 'bg-slate-900 text-white border-slate-900 shadow-2xl' : 'bg-slate-50 border-slate-100 text-slate-900'}`}>
                  {p.popular && (
                     <div className="absolute top-0 -translate-y-1/2 bg-emerald-500 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">Most Popular</div>
                  )}
                  <h4 className={`text-sm font-black uppercase tracking-widest mb-6 ${p.popular ? 'text-emerald-400' : 'text-emerald-600'}`}>{p.title}</h4>
                  <div className="flex items-end gap-1 mb-2">
                     <span className="text-2xl font-bold opacity-40">₹</span>
                     <span className="text-6xl font-black tracking-tighter">{p.price}</span>
                     <span className="text-sm font-bold opacity-40">/mo</span>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-10 opacity-60">Billed Globally</p>
                  <div className="w-full space-y-4 mb-12 flex-1">
                     {p.features.map((f, j) => (
                        <div key={j} className="flex items-center gap-3 justify-center">
                           <CheckCircle2 className={`w-4 h-4 ${p.popular ? 'text-emerald-400' : 'text-emerald-500'}`} />
                           <span className="text-xs font-bold opacity-80">{f}</span>
                        </div>
                     ))}
                  </div>
                  <button onClick={() => openLeadForm(`Procure Plan: ${p.title}`)} className={`w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all ${p.popular ? 'bg-emerald-600 hover:bg-white hover:text-emerald-600 text-white shadow-xl shadow-emerald-500/20' : 'bg-slate-900 text-white hover:bg-black'}`}>
                     Procure Plan
                  </button>
               </div>
            ))}
         </div>
      </section>

       {/* GLOBAL REACH */}
       <section className="py-32 px-10 md:px-20 bg-slate-900 text-white relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
         <div className="flex flex-col md:flex-row items-center gap-20 max-w-7xl mx-auto">
            <div className="flex-1 space-y-10">
               <h2 className="text-5xl font-black tracking-tight leading-none italic">Scaling Without <br/> Borders.</h2>
               <p className="text-lg text-slate-400 font-medium leading-relaxed">
                  From India to UAE, UK to USA — SaSLoop handles international phone formats, global currency symbols, and localized timezones out of the box. 
                  <br/><br/>
                  Deploy your AI agent in minutes and start taking orders from customers anywhere on the planet.
               </p>
               <div className="flex flex-wrap gap-8">
                  <div className="flex flex-col"><span className="text-3xl font-black text-emerald-400">24+</span><span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Countries</span></div>
                  <div className="flex flex-col"><span className="text-3xl font-black text-emerald-400">12</span><span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Currencies</span></div>
                  <div className="flex flex-col"><span className="text-3xl font-black text-emerald-400">99.9%</span><span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Uptime</span></div>
               </div>
            </div>
            <div className="flex-1 flex items-center justify-center relative">
               <div className="w-[400px] h-[400px] bg-white/5 rounded-full shadow-2xl flex items-center justify-center border-8 border-white/5 relative animate-pulse">
                  <Globe className="w-48 h-48 text-emerald-500 opacity-20" />
                  <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 text-emerald-500" />
               </div>
            </div>
         </div>
      </section>

      {/* CONVERSION SECTION */}
      <section className="py-32 px-10 md:px-20 text-center">
         <div className="max-w-6xl mx-auto bg-slate-900 rounded-[4rem] p-16 md:p-32 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl -mr-64 -mt-64 group-hover:bg-emerald-500/20 transition-all duration-700" />
            <div className="relative z-10">
               <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95] mb-10">
                  Ready to Loop your <br/> Business into the <span className="text-emerald-400 italic">Future?</span>
               </h2>
               <p className="text-emerald-200/60 font-bold uppercase text-[12px] tracking-[0.5em] mb-12">No Credit Card Required • Instant Setup</p>
               <button onClick={() => openLeadForm("Launch Store")} className="px-16 py-6 bg-white text-slate-900 rounded-[2.5rem] font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-emerald-50 transition-all active:scale-95">
                  Launch Your Store Now
               </button>
            </div>
         </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 px-10 md:px-20 border-t border-slate-100 text-center">
         <div className="flex items-center justify-center gap-2 mb-8 grayscale opacity-50">
            <SaSLoopLogo />
            <span className="text-lg font-black tracking-tighter uppercase italic text-slate-900">SaSLoop Global</span>
         </div>
         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">© 2026 SaSLoop Cloud Technologies. All Rights Reserved.</p>
      </footer>

      {/* LEAD GENERATION MODAL */}
      {showLeadForm && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setShowLeadForm(false)} />
           <div className="relative w-full max-w-lg bg-white rounded-[3rem] p-12 shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
              <button onClick={() => setShowLeadForm(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900"><X /></button>
              
              {isSuccess ? (
                <div className="text-center py-10 space-y-6">
                   <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto animate-bounce shadow-inner">
                      <CheckCircle2 className="w-10 h-10" />
                   </div>
                   <h3 className="text-3xl font-black tracking-tighter italic">REQUEST RECEIVED!</h3>
                   <p className="text-slate-400 text-xs font-black uppercase tracking-widest leading-relaxed">
                      Our growth agents will call you back within 24 hours to finalize your {leadContext}.
                   </p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-10">
                    <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-500 rounded-full text-[8px] font-black uppercase tracking-widest mb-4">Lead Generation Phase</div>
                    <h3 className="text-4xl font-black tracking-tighter italic leading-none mb-2">{leadContext === "Demo" ? "BOOK A DEMO" : leadContext.toUpperCase()}</h3>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Fill details and our agent will reach out</p>
                  </div>
                  
                  <form onSubmit={handleLeadSubmit} className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">Full Name</label>
                        <input 
                           type="text" required value={leadData.name} onChange={e => setLeadData({...leadData, name: e.target.value})}
                           placeholder="John Doe" 
                           className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-xs font-bold focus:ring-2 focus:ring-emerald-500/20" 
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">WhatsApp Number</label>
                        <input 
                           type="tel" required value={leadData.phone} onChange={e => setLeadData({...leadData, phone: e.target.value})}
                           placeholder="+91 98765 43210" 
                           className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-xs font-bold focus:ring-2 focus:ring-emerald-500/20" 
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">Business Name</label>
                        <input 
                           type="text" required value={leadData.business} onChange={e => setLeadData({...leadData, business: e.target.value})}
                           placeholder="My Awesome Cafe" 
                           className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-xs font-bold focus:ring-2 focus:ring-emerald-500/20" 
                        />
                     </div>
                     
                     <button 
                        type="submit" disabled={isSubmitting}
                        className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl hover:bg-black transition-all active:scale-95 disabled:opacity-50"
                     >
                        {isSubmitting ? "Processing..." : "Submit Request"}
                     </button>
                  </form>
                </>
              )}
           </div>
        </div>
      )}

    </div>
  );
}

export default LandingPage;
