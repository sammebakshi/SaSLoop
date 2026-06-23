const TransitionSplashScreen = ({ username }) => {
  const [statusText, setStatusText] = useState('DECRYPTING KEY...');

  useEffect(() => {
    const statuses = [
      { time: 0, text: 'DECRYPTING KEY...' },
      { time: 900, text: 'VERIFYING COMBINATION...' },
      { time: 1950, text: 'AUTHORIZING ACCESS...' },
      { time: 2700, text: 'ACCESS GRANTED' }
    ];

    const timeouts = statuses.map(s => 
      setTimeout(() => setStatusText(s.text), s.time)
    );

    return () => timeouts.forEach(t => clearTimeout(t));
  }, []);

  return (
    <>
      <style>{`
        .dial-knob {
          transform-origin: 150px 150px;
          animation: dial-spin-sequence 3s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        @keyframes dial-spin-sequence {
          0% { transform: rotate(0deg); }
          30% { transform: rotate(120deg); }
          65% { transform: rotate(-80deg); }
          90% { transform: rotate(40deg); }
          100% { transform: rotate(40deg); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(12px); }
        }
      `}</style>
      <div className="flex flex-col items-center justify-center relative select-none z-50">
        {/* Glow effect around the dial */}
        <div className="absolute w-[280px] h-[280px] rounded-full bg-[#18ba60]/10 blur-[60px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0" />
        
        <div className="relative z-10 flex flex-col items-center">
          {/* Circular Vault Safe Dial SVG */}
          <div className="relative">
            <svg width="260" height="260" viewBox="0 0 300 300" className="overflow-visible select-none filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]">
              <defs>
                <radialGradient id="metallicSteel" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="30%" stopColor="#cbd5e1" />
                  <stop offset="70%" stopColor="#94a3b8" />
                  <stop offset="95%" stopColor="#475569" />
                  <stop offset="100%" stopColor="#1e293b" />
                </radialGradient>
              </defs>
              
              {/* Outer Metallic Rim */}
              <circle cx="150" cy="150" r="140" fill="url(#metallicSteel)" stroke="#475569" strokeWidth="3" />
              
              {/* Screws/bolts around the rim */}
              <circle cx="150" cy="22" r="4" fill="#64748b" stroke="#334155" strokeWidth="1" />
              <circle cx="242" cy="58" r="4" fill="#64748b" stroke="#334155" strokeWidth="1" />
              <circle cx="278" cy="150" r="4" fill="#64748b" stroke="#334155" strokeWidth="1" />
              <circle cx="242" cy="242" r="4" fill="#64748b" stroke="#334155" strokeWidth="1" />
              <circle cx="150" cy="278" r="4" fill="#64748b" stroke="#334155" strokeWidth="1" />
              <circle cx="58" cy="242" r="4" fill="#64748b" stroke="#334155" strokeWidth="1" />
              <circle cx="22" cy="150" r="4" fill="#64748b" stroke="#334155" strokeWidth="1" />
              <circle cx="58" cy="58" r="4" fill="#64748b" stroke="#334155" strokeWidth="1" />
              
              {/* Dark Static Ring */}
              <circle cx="150" cy="150" r="115" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
              
              {/* Ticks on static ring */}
              <line x1="150" y1="35" x2="150" y2="45" stroke="#475569" strokeWidth="2" />
              <line x1="250" y1="150" x2="260" y2="150" stroke="#475569" strokeWidth="2" />
              <line x1="150" y1="255" x2="150" y2="265" stroke="#475569" strokeWidth="2" />
              <line x1="40" y1="150" x2="50" y2="150" stroke="#475569" strokeWidth="2" />
              
              {/* Static Labels */}
              <text x="150" y="60" fill="#f8fafc" fontSize="12" fontWeight="900" textAnchor="middle">100</text>
              <text x="230" y="154" fill="#f8fafc" fontSize="12" fontWeight="900" textAnchor="middle">11.3</text>
              <text x="150" y="246" fill="#f8fafc" fontSize="12" fontWeight="900" textAnchor="middle">ICO</text>
              <text x="70" y="154" fill="#f8fafc" fontSize="12" fontWeight="900" textAnchor="middle">-191</text>
              
              {/* Red index triangle pointer at top */}
              <polygon points="150,30 144,18 156,18" fill="#ef4444" />
              
              {/* Rotating Inner Core */}
              <g className="dial-knob">
                {/* Silver Dial Face */}
                <circle cx="150" cy="150" r="82" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
                <circle cx="150" cy="150" r="72" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
                
                {/* Combination Marks */}
                <text x="150" y="94" fill="#1e293b" fontSize="10" fontWeight="900" textAnchor="middle">OFF</text>
                <text x="150" y="94" fill="#1e293b" fontSize="10" fontWeight="900" textAnchor="middle" transform="rotate(45 150 150)">15</text>
                <text x="150" y="94" fill="#1e293b" fontSize="10" fontWeight="900" textAnchor="middle" transform="rotate(90 150 150)">30</text>
                <text x="150" y="94" fill="#1e293b" fontSize="10" fontWeight="900" textAnchor="middle" transform="rotate(135 150 150)">50</text>
                <text x="150" y="94" fill="#1e293b" fontSize="10" fontWeight="900" textAnchor="middle" transform="rotate(180 150 150)">68</text>
                <text x="150" y="94" fill="#1e293b" fontSize="10" fontWeight="900" textAnchor="middle" transform="rotate(225 150 150)">80</text>
                <text x="150" y="94" fill="#1e293b" fontSize="10" fontWeight="900" textAnchor="middle" transform="rotate(270 150 150)">90</text>
                <text x="150" y="94" fill="#1e293b" fontSize="10" fontWeight="900" textAnchor="middle" transform="rotate(315 150 150)">L5</text>
                
                {/* Dial Ticks */}
                <line x1="150" y1="72" x2="150" y2="78" stroke="#94a3b8" strokeWidth="2" transform="rotate(0 150 150)" />
                <line x1="150" y1="72" x2="150" y2="78" stroke="#94a3b8" strokeWidth="2" transform="rotate(45 150 150)" />
                <line x1="150" y1="72" x2="150" y2="78" stroke="#94a3b8" strokeWidth="2" transform="rotate(90 150 150)" />
                <line x1="150" y1="72" x2="150" y2="78" stroke="#94a3b8" strokeWidth="2" transform="rotate(135 150 150)" />
                <line x1="150" y1="72" x2="150" y2="78" stroke="#94a3b8" strokeWidth="2" transform="rotate(180 150 150)" />
                <line x1="150" y1="72" x2="150" y2="78" stroke="#94a3b8" strokeWidth="2" transform="rotate(225 150 150)" />
                <line x1="150" y1="72" x2="150" y2="78" stroke="#94a3b8" strokeWidth="2" transform="rotate(270 150 150)" />
                <line x1="150" y1="72" x2="150" y2="78" stroke="#94a3b8" strokeWidth="2" transform="rotate(315 150 150)" />
                
                {/* Central steel knob */}
                <circle cx="150" cy="150" r="35" fill="url(#metallicSteel)" stroke="#475569" strokeWidth="2" />
                <rect x="147" y="140" width="6" height="20" rx="1.5" fill="#1e293b" />
                <circle cx="150" cy="150" r="5" fill="#1e293b" />
              </g>
            </svg>
          </div>
          
          <div className="mt-8 text-center space-y-2">
            <h2 className="text-white text-xs font-black uppercase tracking-[0.25em] animate-pulse">
              {statusText}
            </h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Securing session data for <span className="text-[#18ba60]">{username || 'User'}</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
