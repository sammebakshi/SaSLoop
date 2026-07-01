"const TransitionSplashScreen = ({ username }) => {
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
                  <stop offset="0%" stop-color="#f8fafc" />
                  <stop offset="30%" stop-color="#cbd5e1" />
                  <stop offset="70%" stop-color="#94a3b8" />
                  <stop offset="95%" sto
<truncated 7000 bytes>