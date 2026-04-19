import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import API_BASE from "../config";
import { Mail, Lock, Building2, EyeOff, Eye, ChevronDown, Infinity, AlertCircle, X, Shield, Loader2 } from "lucide-react";

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

const POSITIONS = [
  { left: '4%', top: '12%' },
  { left: '8%', top: '68%' },
  { right: '6%', top: '10%' },
  { right: '10%', top: '65%' },
  { left: '6%', top: '40%' },
  { right: '8%', top: '38%' },
];

const ChatAnimationBackground = () => {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    let bubbleId = 0;

    const spawnBubble = () => {
      const regions = [
        { left: '4%', top: '12%' },
        { left: '8%', top: '65%' },
        { right: '6%', top: '10%' },
        { right: '10%', top: '62%' },
        { left: '6%', top: '38%' },
        { right: '8%', top: '35%' }
      ];
      
      const region = regions[Math.floor(Math.random() * regions.length)];
      
      // Jitter positions randomly on spawn to feel organic
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

    // Spawn the first initial conversation immediately
    setBubbles([spawnBubble()]);

    // Continuously cycle: Sweep old, Spawn new organically
    const interval = setInterval(() => {
      setBubbles(prev => {
        const now = Date.now();
        // Remove conversations older than 14 seconds (matching their CSS fade out lifespan)
        const alive = prev.filter(b => now - b.createdAt < 14000);
        // Continuously spawn exactly 1 new random conversation pulse
        return [...alive, spawnBubble()];
      });
    }, 2600); // Spawning roughly every 2.6s guarantees 5-6 ongoing overlapping conversations

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-slate-900 pointer-events-none">
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
      
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black opacity-90"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[120px]" />

      {/* Floating Chat Bubbles */}
      <div className="absolute inset-0 flex items-center justify-center opacity-70">
        <div className="relative w-full max-w-7xl h-full hidden lg:block">
          
          {bubbles.map((b) => (
              <div key={b.id} style={{...b.pos, position: 'absolute', zIndex: b.id}}>
                
                {/* Customer Message */}
                <div 
                  className="max-w-[260px] w-full p-4 rounded-2xl rounded-bl-sm bg-slate-800/80 border border-slate-700/50 backdrop-blur-md shadow-2xl dyn-bubble-c1 opacity-0"
                  style={{ animationDelay: '0s, 0s' }}
                >
                  <div className="text-[10px] text-slate-400 mb-1 font-semibold uppercase tracking-wider">Customer</div>
                  <div className="text-sm text-slate-200">{b.convo.c}</div>
                </div>
                
                {/* AI Response Message (enters 1.2s after customer naturally) */}
                <div 
                  className="absolute top-[80%] left-4 max-w-[300px] w-max lg:w-[300px] p-4 rounded-2xl rounded-tl-sm bg-emerald-900/40 border border-emerald-500/30 backdrop-blur-md shadow-2xl dyn-bubble-c2 opacity-0"
                  style={{ animationDelay: '1.2s, 1s' }}
                >
                  <div className="flex items-center gap-2 text-[10px] text-emerald-400 mb-1 font-semibold uppercase tracking-wider">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    SaS Loop AI
                  </div>
                  <div className="text-sm text-slate-200">{b.convo.r}</div>
                </div>
              </div>
          ))}

        </div>

        {/* Typing Indicator for smaller screens / overall center aesthetic */}
        <div className="absolute left-[50%] -translate-x-[50%] top-[85%] max-w-[280px] w-full p-4 rounded-2xl rounded-br-sm bg-emerald-900/40 border border-emerald-500/30 backdrop-blur-md shadow-2xl dyn-bubble-c2" style={{ animationDelay: '0s, 0s' }}>
          <div className="flex items-center gap-2 text-[10px] text-emerald-400 mb-2 font-semibold uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Auto Replying
          </div>
          <div className="flex gap-1.5 items-center h-5 px-1 bg-slate-900/50 w-max rounded-full py-2">
            <span className="w-1.5 h-1.5 bg-emerald-500/80 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-1.5 h-1.5 bg-emerald-500/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1.5 h-1.5 bg-emerald-500/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
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
        } else if (userData.role && userData.role.startsWith("admin")) {
          window.location.href = "/admin-dashboard";
        } else {
          window.location.href = "/dashboard";
        }
      } else {
        setErrorMsg(data.error || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("FRONTEND ERROR:", err);
      setErrorMsg("Server error. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <ChatAnimationBackground />
      
      {/* Login Card */}
      <div className="w-full max-w-[420px] bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 relative z-10 overflow-hidden transform transition-all duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
        
        {/* Top Decorative Header */}
        <div className="h-32 bg-gradient-to-br from-slate-900 to-slate-800 relative flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2694&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay" />
          <div className="z-10 text-center">
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-1">
               <SaSLoopLogo />
               SaS <span className="text-emerald-400">Loop AI</span>
            </h1>
            <p className="text-slate-400 font-medium mt-1 text-xs tracking-widest uppercase h-[20px] flex justify-center items-center">
              <TypewriterText />
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="p-8 pb-10">
          
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Welcome Back</h2>
            <p className="text-sm text-slate-500 mt-1">Sign in to manage your AI automations</p>
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
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <input
                className="w-full py-4 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 outline-none text-sm font-medium focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
                placeholder="Email or Username"
                value={identifier}
                onChange={(e)=>setIdentifier(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                <Lock className="w-5 h-5" />
              </div>
              <input
                className="w-full py-4 pl-12 pr-12 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 outline-none text-sm font-medium focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                required
                onChange={(e)=>setPassword(e.target.value)}
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
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-2xl transition-all shadow-[0_4px_14px_0_rgba(15,23,42,0.2)] hover:shadow-[0_6px_20px_rgba(15,23,42,0.3)] hover:-translate-y-0.5 active:translate-y-0"
              >
                Sign In
              </button>
              
              <div className="text-center mt-5">
                <button 
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-sm font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            </div>
          </form>
        </div>
        
        {/* Footer */}
        <div className="bg-slate-50/80 p-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 font-medium">
              Don't have an account? <a href="https://wa.me/919469697216?text=Hi,%20I%20need%20help%20with%20my%20SaS%20Loop%20AI%20account" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 font-semibold">Contact Support</a>
            </p>
        </div>

      </div>

      {/* RECOVERY MODAL */}
      {isForgotModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsForgotModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-300">
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