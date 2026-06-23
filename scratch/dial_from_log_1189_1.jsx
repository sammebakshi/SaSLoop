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
        .lock-shackle {
          transform-origin: 65px 90px;
          animation: shackle-unlock 3s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .dial-knob {
          transform-origin: 100px 130px;
          animation: dial-spin-sequence 3s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        @keyframes dial-spin-sequence {
          0% { transform: rotate(0deg); }
          30% { transform: rotate(120deg); }
          65% { transform: rotate(-80deg); }
          90% { transform: rotate(40deg); }
          100% { transform: rotate(40deg); }
        }
        @keyframes shackle-unlock {
          0%, 88% {
            transform: translateY(0) rotate(0deg);
            stroke: #484f58;
          }
          92% {
            transform: translateY(-15px) rotate(0deg);
            stroke: #18ba60;
          }
          100% {
            transform: translateY(-15px) rotate(-15deg);
            stroke: #18ba60;
          }
        }
      `}</style>
      <div className="flex flex-col items-center justify-center p-8 rounded-[2.5rem] border border-white/10 bg-[#0d1117]/85 backdrop-blur-xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] w-[360px] relative select-none z-50">
        {/* Glow effect */}
        <div className="absolute w-[200px] h-[200px] rounded-full bg-[#18ba60]/10 blur-[50px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 animate-pulse" />
   
<truncated 2530 bytes>