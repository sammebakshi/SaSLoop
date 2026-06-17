import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import API_BASE from "../config";
import { User, Mail, Lock, Building2, EyeOff, Eye, ChevronDown, Infinity, AlertCircle, X, Shield, Loader2, Utensils, Receipt, MessageSquare, ShoppingCart, Layers, Truck } from "lucide-react";

const SaSLoopLogo = () => (
  <svg width="34" height="34" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1.5 drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]">
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

    {/* WhatsApp Chat Bubble Silhouette */}
    <path d="M 18,50 C 18,30 32,16 50,16 C 68,16 82,30 82,50 C 82,70 68,84 50,84 C 44,84 38,82 34,79 L 18,84 L 22,70 C 19.5,64 18,57 18,50 Z" 
          stroke="url(#waGradient)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="rgba(16,185,129,0.05)" />

    {/* Automation / AI Loop Core */}
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

const FLOATING_ITEMS = [
  { type: 'receipt', id: '9824', items: [{n: 'Cappuccino', q: 2, p: 120}, {n: 'Choco Lava', q: 1, p: 120}], total: 360 },
  { type: 'receipt', id: '9825', items: [{n: 'Veg Biryani', q: 1, p: 250}, {n: 'Lime Soda', q: 2, p: 60}], total: 370 },
  { type: 'kot', id: '4410', table: 'Table 5', items: [{n: 'Butter Chicken', q: 1}, {n: 'Butter Naan', q: 3}] },
  { type: 'kot', id: '4411', table: 'Table 2', items: [{n: 'Veg Noodles', q: 2}, {n: 'Spring Roll', q: 1}] },
  { type: 'pos_terminal' },
  { type: 'delivery', id: '#443', dest: 'Sector 4, Main Rd', driver: 'Rajesh', status: 'On The Way' },
  { type: 'delivery', id: '#444', dest: 'Tech Park, Bldg 3', driver: 'Suresh', status: 'Picked Up' }
];

const ChatAnimationBackground = () => {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    let bubbleId = 0;
    const regions = [
      { id: 0, left: '4%', top: '10%' },
      { id: 1, left: '26%', top: '12%' },
      { id: 2, left: '48%', top: '10%' },
      { id: 3, left: '4%', top: '35%' },
      { id: 4, left: '26%', top: '38%' },
      { id: 5, left: '48%', top: '42%' }
    ];

    const spawnInitial = () => {
      const initialRegion = regions[Math.floor(Math.random() * regions.length)];
      const jX = Math.floor(Math.random() * 6) - 3;
      const jY = Math.floor(Math.random() * 6) - 3;
      return {
        id: ++bubbleId,
        regionId: initialRegion.id,
        pos: {
          left: `calc(${initialRegion.left} + ${jX}%)`,
          top: `calc(${initialRegion.top} + ${jY}%)`
        },
        item: FLOATING_ITEMS[Math.floor(Math.random() * FLOATING_ITEMS.length)],
        createdAt: Date.now()
      };
    };

    setBubbles([spawnInitial()]);

    const interval = setInterval(() => {
      setBubbles(prev => {
        const now = Date.now();
        const alive = prev.filter(b => now - b.createdAt < 14000);
        
        const occupiedIds = alive.map(b => b.regionId);
        const available = regions.filter(r => !occupiedIds.includes(r.id));
        const selected = available.length > 0
          ? available[Math.floor(Math.random() * available.length)]
          : regions[Math.floor(Math.random() * regions.length)];
          
        const jX = Math.floor(Math.random() * 6) - 3;
        const jY = Math.floor(Math.random() * 6) - 3;
        const pos = {
          left: `calc(${selected.left} + ${jX}%)`,
          top: `calc(${selected.top} + ${jY}%)`
        };

        const newBubble = {
          id: ++bubbleId,
          regionId: selected.id,
          pos,
          item: FLOATING_ITEMS[Math.floor(Math.random() * FLOATING_ITEMS.length)],
          createdAt: now
        };

        return [...alive, newBubble];
      });
    }, 2600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-slate-50 pointer-events-none">
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
      `}</style>
      
      {/* Background Image of Restaurant */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/login_bg.png")' }}></div>
      <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-[3px]"></div>
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/60 via-slate-50/70 to-slate-200/80 opacity-90"></div>
      
      {/* Premium Dot Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-60"></div>
      
      {/* Rich Ambient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#18ba60]/15 blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/15 blur-[100px]" />
      <div className="absolute top-[35%] right-[15%] w-[35%] h-[35%] rounded-full bg-indigo-500/10 blur-[90px]" />

      <div className="absolute inset-0 flex items-center justify-center opacity-70">
        <div className="relative w-full max-w-7xl h-full hidden md:block">
          {bubbles.map((b) => (
              <div key={b.id} style={{...b.pos, position: 'absolute', zIndex: b.id}} className="dyn-bubble-c1 opacity-0">
                {b.item.type === 'receipt' ? (
                   <div className="w-[200px] bg-white shadow-xl border border-slate-100 relative pb-4 text-slate-800" style={{ filter: 'drop-shadow(0 15px 20px rgba(0,0,0,0.06))' }}>
                      <div className="p-4 flex flex-col font-mono text-[9px] leading-tight">
                         <div className="text-center font-black uppercase text-[11px] tracking-wider border-b border-dashed border-slate-300 pb-2 mb-2">
                            SaSLoop Receipt<br/>
                            <span className="text-[8px] text-slate-400 font-bold">INV-{b.item.id}</span>
                          </div>
                          <div className="space-y-1 mb-2">
                             {b.item.items.map((it, i) => (
                                <div key={i} className="flex justify-between"><span>{it.q}x {it.n}</span><span>₹{it.q * it.p}</span></div>
                             ))}
                          </div>
                          <div className="border-t border-dashed border-slate-300 pt-2 flex justify-between font-black text-[10px]">
                             <span>Total</span><span>₹{b.item.total}</span>
                          </div>
                      </div>
                      <div className="absolute bottom-[-6px] left-0 w-full h-[6px]" style={{ backgroundImage: 'linear-gradient(-45deg, transparent 4px, white 4px), linear-gradient(45deg, transparent 4px, white 4px)', backgroundSize: '12px 12px', backgroundRepeat: 'repeat-x' }}></div>
                   </div>
                ) : b.item.type === 'kot' ? (
                   <div className="w-[200px] bg-[#fdfaf2] shadow-xl border border-amber-100 relative pb-4 text-amber-900" style={{ filter: 'drop-shadow(0 15px 20px rgba(0,0,0,0.06))' }}>
                      <div className="p-4 flex flex-col font-mono text-[9px] leading-tight">
                         <div className="text-center font-black uppercase text-[11px] tracking-wider border-b border-dashed border-amber-200 pb-2 mb-2 text-amber-800">
                            Kitchen Ticket<br/>
                            <span className="text-[8px] text-amber-500 font-bold">KOT #{b.item.id}</span>
                         </div>
                         <div className="text-[10px] font-black mb-1.5 text-slate-800">{b.item.table.toUpperCase()}</div>
                         <div className="space-y-1 mb-1">
                            {b.item.items.map((it, i) => (
                               <div key={i} className="font-bold">{it.q}x {it.n}</div>
                            ))}
                         </div>
                      </div>
                      <div className="absolute bottom-[-6px] left-0 w-full h-[6px]" style={{ backgroundImage: 'linear-gradient(-45deg, transparent 4px, #fdfaf2 4px), linear-gradient(45deg, transparent 4px, #fdfaf2 4px)', backgroundSize: '12px 12px', backgroundRepeat: 'repeat-x' }}></div>
                   </div>
                ) : b.item.type === 'pos_terminal' ? (
                   <div className="w-[200px] bg-slate-900 text-white rounded-2xl p-4 shadow-xl border border-slate-800 flex flex-col items-center gap-2" style={{ filter: 'drop-shadow(0 15px 20px rgba(0,0,0,0.12))' }}>
                      <svg width="48" height="48" viewBox="0 0 100 100" fill="none" className="text-emerald-400">
                         <rect x="15" y="20" width="70" height="45" rx="6" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="4"/>
                         <rect x="22" y="27" width="56" height="31" rx="2" fill="currentColor"/>
                         <path d="M30 65 L20 85 H80 L70 65" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                         <rect x="25" y="82" width="50" height="6" rx="3" fill="currentColor"/>
                      </svg>
                      <div className="flex flex-col text-center">
                         <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">SaSLoop POS</span>
                         <span className="text-[8px] text-slate-400 font-bold mt-0.5">Terminal Active</span>
                      </div>
                   </div>
                ) : (
                   <div className="w-[200px] bg-white rounded-2xl p-4 shadow-xl border border-slate-100 flex flex-col gap-2.5 text-slate-800" style={{ filter: 'drop-shadow(0 15px 20px rgba(0,0,0,0.06))' }}>
                      <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                         <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                            <Truck size={14} strokeWidth={2.5}/>
                         </div>
                         <div>
                            <div className="text-[10px] font-black uppercase tracking-tight leading-none">Delivery</div>
                            <div className="text-[8px] font-bold text-amber-500 animate-pulse mt-0.5">{b.item.status}</div>
                         </div>
                      </div>
                      <div className="space-y-1.5 text-[8.5px] font-bold text-slate-500 leading-none">
                         <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"/> {b.item.dest}</div>
                         <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/> Driver: {b.item.driver}</div>
                      </div>
                   </div>
                )}
              </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const featuresList = [
  {
    title: "Kitchen Order Tickets (KOT)",
    desc: "Instantly route order items to kitchen departments, configure multi-printer layouts, and optimize chef workflows with real-time preparation tracking.",
    icon: Utensils,
    color: "from-emerald-500 to-teal-600",
    badge: "KDS & KOT Engine"
  },
  {
    title: "Receipts & Billing",
    desc: "Generate professional thermal invoices, process cash/UPI/card settlements, track outstanding customer dues, and print custom layouts.",
    icon: Receipt,
    color: "from-blue-500 to-indigo-600",
    badge: "Finance & POS"
  },
  {
    title: "WhatsApp Orders",
    desc: "Direct customer booking via WhatsApp channels, automated receipt broadcasting, and CRM marketing engines.",
    icon: MessageSquare,
    color: "from-green-500 to-emerald-600",
    badge: "Marketing & CRM"
  },
  {
    title: "Online Orders",
    desc: "Accept incoming digital channel sales, coordinate delivery driver assignments, track delivery ETAs, and auto-sync online platforms.",
    icon: ShoppingCart,
    color: "from-orange-500 to-rose-600",
    badge: "Digital Channels"
  },
  {
    title: "Table Orders",
    desc: "Orchestrate dine-in table layouts, manage reservations, visual table status colors, and coordinate waiter table order mappings.",
    icon: Layers,
    color: "from-purple-500 to-violet-600",
    badge: "Floor Plan Seating"
  }
];

const FeatureShowcase = () => {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setIndex(idx => (idx + 1) % featuresList.length);
          return 0;
        }
        return prev + 2;
      });
    }, 80);

    return () => clearInterval(progressInterval);
  }, [index]);

  const activeFeature = featuresList[index];
  const IconComponent = activeFeature.icon;

  return (
    <div className="absolute bottom-6 left-6 hidden lg:flex flex-col max-w-[440px] text-slate-800 z-10 space-y-4 select-none text-left">
      <div className="flex items-center gap-2">
        <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-[#18ba60]/10 text-[#18ba60] border border-[#18ba60]/20 rounded-full">
          Core Features
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#18ba60] animate-pulse"></span>
      </div>

      <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-[2rem] p-8 shadow-2xl shadow-slate-200/50 flex flex-col relative overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_rgba(24,186,96,0.05)]">
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br ${activeFeature.color} opacity-5 blur-[40px] transition-all duration-500`} />

        <div className="flex items-start gap-5">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${activeFeature.color} flex items-center justify-center text-white shadow-lg shrink-0 transition-all duration-500 transform hover:scale-105`}>
            <IconComponent size={24} strokeWidth={2.5} />
          </div>

          <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#18ba60]">{activeFeature.badge}</span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1 uppercase tracking-tight leading-tight transition-all duration-500">
              {activeFeature.title}
            </h3>
          </div>
        </div>

        <p className="text-slate-600 text-[12px] font-semibold leading-relaxed mt-5 min-h-[56px] transition-all duration-500">
          {activeFeature.desc}
        </p>

        <div className="flex items-center gap-2.5 mt-8">
          {featuresList.map((f, i) => (
            <button
              key={f.title}
              onClick={() => { setIndex(i); setProgress(0); }}
              className={`h-2.5 rounded-full transition-all duration-300 ${i === index ? `w-8 bg-gradient-to-r ${f.color}` : 'w-2.5 bg-slate-300 hover:bg-slate-400'}`}
              title={f.title}
            />
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
          <div 
            className={`h-full bg-gradient-to-r ${activeFeature.color} transition-all duration-75`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (token && user?.id && user?.role) {
        if (user.role === "master_admin") window.location.href = "/master-dashboard";
        else if (user.role.startsWith("admin") || user.role === "brand_owner") window.location.href = "/admin-dashboard";
        else window.location.href = "/dashboard";
      } else if (token) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.clear();
      }
    } catch (err) {
      console.error("Session Restoration Error:", err);
      localStorage.clear();
      sessionStorage.clear();
    }
  }, []);

  // RECOVERY STATES
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState(1);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryQuestion, setRecoveryQuestion] = useState("");
  const [recoveryAnswer, setRecoveryAnswer] = useState("");
  const [recoveryNewPassword, setRecoveryNewPassword] = useState("");
  const [recoveryError, setRecoveryError] = useState("");
  const [recoveryLoading, setRecoveryLoading] = useState(false);

  const handleGetQuestion = async () => {
     setRecoveryError("");
     if (!recoveryEmail) return setRecoveryError("Please enter your email.");
     setRecoveryLoading(true);
     try {
        const res = await fetch(`${API_BASE}/api/auth/get-recovery-question`, {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ email: recoveryEmail })
        });
        const data = await res.json();
        if (res.ok) {
           setRecoveryQuestion(data.question);
           setRecoveryStep(2);
        } else {
           setRecoveryError(data.error);
        }
     } catch (err) { setRecoveryError("Connection error."); }
     finally { setRecoveryLoading(false); }
  };

  const handleResetPassword = async () => {
    setRecoveryError("");
    if (!recoveryAnswer || !recoveryNewPassword) return setRecoveryError("All fields are required.");
    setRecoveryLoading(true);
    try {
       const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: recoveryEmail, answer: recoveryAnswer, newPassword: recoveryNewPassword })
       });
       const data = await res.json();
       if (res.ok) {
          alert("Success! Password reset. You can now login.");
          setIsForgotModalOpen(false);
          setRecoveryStep(1);
          setRecoveryEmail("");
          setRecoveryAnswer("");
          setRecoveryNewPassword("");
       } else {
          setRecoveryError(data.error);
       }
    } catch (err) { setRecoveryError("Connection error."); }
    finally { setRecoveryLoading(false); }
  };

  const handleLogin = async () => {
    setErrorMsg("");
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (res.ok) {
        const userData = data.user || data;
        localStorage.setItem("token", data.token || "dummy-token");
        localStorage.setItem("user", JSON.stringify(userData));

        if (userData.role === "master_admin") {
          window.location.href = "/master-dashboard";
        } else if (userData.role && (userData.role.startsWith("admin") || userData.role === "brand_owner")) {
          window.location.href = "/admin-dashboard";
        } else {
          window.location.href = "/dashboard";
        }
      } else {
        setErrorMsg(data.error || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("FRONTEND LOGIN ERROR:", err);
      if (err.message === "Failed to fetch") {
        setErrorMsg("Network Error: Could not reach the server. Is the backend running?");
      } else {
        setErrorMsg("Connection Error: " + (err.message || "Please try again later."));
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 relative select-none">
      <div className="flex-1 flex items-center justify-center lg:justify-end p-4 lg:pr-28 relative overflow-hidden">
        <ChatAnimationBackground />
        
        {/* Bottom Left: Animated Features Showcase */}
        <FeatureShowcase />
        
        {/* Login Card */}
        <div className="w-full max-w-[400px] sm:max-w-[420px] bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-200 relative z-10 overflow-hidden transform transition-all duration-300 hover:shadow-[0_20px_60px_rgba(24,186,96,0.1)] mx-2">
          
          {/* Top Decorative Header */}
          <div className="h-32 bg-gradient-to-br from-[#0d1117] to-[#1c4934] relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-cover bg-center mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.15\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
            <div className="z-10 text-center">
              <h1 className="text-2xl font-extrabold text-white tracking-tighter flex items-center justify-center gap-1">
                 <img src="/logo.png" alt="SaSLoop Logo" className="w-9 h-9 object-contain mr-1 bg-white rounded-full p-1" />
                 SaSLoop <span className="text-[#18ba60]">POS</span>
              </h1>
              <p className="text-emerald-400 font-medium mt-1 text-[10px] tracking-widest uppercase h-[20px] flex justify-center items-center">
                <TypewriterText />
              </p>
            </div>
          </div>

          {/* Form Container */}
          <div className="p-8 pb-10">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">SaSLoop POS</h2>
              <p className="text-[11px] text-slate-500 mt-1 font-semibold uppercase tracking-widest">Backoffice Access</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
              {/* Custom Error Dialog */}
              {errorMsg && (
                <div className="bg-red-50 text-red-600 text-[13px] p-3 rounded-xl border border-red-100 flex items-start gap-2 animate-[pulse_0.4s_ease-in-out]">
                   <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                   <span className="font-medium">{errorMsg}</span>
                </div>
              )}

              {/* Email/Username Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#18ba60] transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input
                  className="w-full py-4 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 outline-none text-sm font-bold focus:border-[#18ba60] focus:ring-1 focus:ring-[#18ba60] transition-all placeholder:text-slate-400 shadow-inner"
                  placeholder="Email or Username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#18ba60] transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  className="w-full py-4 pl-12 pr-12 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 outline-none text-sm font-bold focus:border-[#18ba60] focus:ring-1 focus:ring-[#18ba60] transition-all placeholder:text-slate-400 shadow-inner"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  type="button"
                >
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>

              {/* Form Actions */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#18ba60] hover:bg-[#15a353] text-white font-black uppercase tracking-widest text-xs py-4 rounded-2xl transition-all shadow-lg shadow-[#18ba60]/20 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                >
                  SIGN IN
                </button>
                
                <div className="text-center mt-5">
                  <button 
                    type="button"
                    onClick={() => setIsForgotModalOpen(true)}
                    className="text-xs font-bold text-slate-500 hover:text-[#18ba60] transition-colors uppercase tracking-wider"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
            </form>
          </div>
          
          {/* Footer */}
          <div className="bg-slate-50 border-t border-slate-100 text-center flex justify-between items-center px-6 py-4">
              <p className="text-[10px] text-slate-500 font-bold">
                SaSLoop POS v1.0.1
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold">
                 <Shield size={10} /> Secure Connection
              </div>
          </div>

        </div>
      </div>

      {/* RECOVERY MODAL */}
      {isForgotModalOpen && createPortal(
        <div className="pro-modal-overlay">
          <div className="pro-modal-content max-w-md p-8 relative">
             <button onClick={() => { setIsForgotModalOpen(false); setRecoveryStep(1); }} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"><X /></button>

             
             <div className="text-center mb-8">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                   <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Recover Account</h3>
                <p className="text-slate-500 text-sm mt-1">Follow the steps to reset your password</p>
             </div>

             {recoveryStep === 1 && (
               <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Enter Register Email</label>
                     <input 
                       className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500" 
                       placeholder="email@example.com"
                       value={recoveryEmail}
                       onChange={e => setRecoveryEmail(e.target.value)}
                     />
                  </div>
                  <button 
                    onClick={handleGetQuestion}
                    disabled={recoveryLoading}
                    className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                  >
                    {recoveryLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Verify Email"}
                  </button>
               </div>
             )}

             {recoveryStep === 2 && (
               <div className="space-y-5">
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                     <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mb-1">Security Question</p>
                     <p className="text-slate-800 font-bold text-sm">{recoveryQuestion}</p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Your Answer</label>
                     <input 
                       className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500" 
                       placeholder="Type your answer here..."
                       value={recoveryAnswer}
                       onChange={e => setRecoveryAnswer(e.target.value)}
                     />
                  </div>
                  <div className="flex flex-col gap-1.5">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">New Password</label>
                     <input 
                       type="password"
                       className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500" 
                       placeholder="At least 8 characters"
                       value={recoveryNewPassword}
                       onChange={e => setRecoveryNewPassword(e.target.value)}
                     />
                  </div>
                  <button 
                    onClick={handleResetPassword}
                    disabled={recoveryLoading}
                    className="w-full py-4 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    {recoveryLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Reset & Save Password"}
                  </button>
                  <p className="text-[10px] text-slate-400 text-center uppercase font-bold tracking-widest">Answer is not case-sensitive</p>
               </div>
             )}

             {recoveryError && (
               <p className="mt-4 text-center text-xs text-rose-500 font-bold flex items-center justify-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {recoveryError}
               </p>
             )}
          </div>
        </div>
      , document.body)}

    </div>
  );
}

export default Login;
