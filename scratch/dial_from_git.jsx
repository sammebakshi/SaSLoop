const TransitionSplashScreen = ({ username }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 35);
    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div className="w-[430px] bg-gradient-to-b from-[#0d1117] to-[#161b22] border border-slate-800 text-white rounded-[2.5rem] p-8 pb-10 text-center shadow-[0_25px_60px_rgba(0,0,0,0.6)] relative overflow-hidden select-none mx-4">
      {/* Honeycomb Pattern Background inside card */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none z-0" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='56' height='96' viewBox='0 0 56 96' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M28 0 L0 16 L0 48 L28 64 M28 64 L28 96' fill='none' stroke='%2318ba60' stroke-width='1.2'/%3E%3C/svg%3E")`,
          backgroundSize: '56px 96px'
        }} 
      />
      
      {/* Glow effect */}
      <div className="absolute w-[300px] h-[300px] rounded-full bg-[#18ba60]/5 blur-[80px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 animate-pulse" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Check/Success or Logo */}
        <motion.div 
          initial={{ scale: 0.5, rotate: -45, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 12 }}
          className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
        >
          <Shield className="w-8 h-8 text-[#18ba60] animate-pulse" />
        </motion.div>

        {/* Welcome Text */}
        <motion.h2 
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-xl font-black tracking-tight mb-2"
        >
          Access Granted
        </motion.h2>

        <motion.p 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-xs text-slate-400 font-semibold mb-6"
        >
          Welcome back, <span className="text-[#18ba60] font-black">{username || 'User'}</span>!
        </motion.p>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-3">
          <div 
            className="h-full bg-gradient-to-r from-[#18ba60] to-[#2ecc71] transition-all duration-700 ease-out rounded-full shadow-[0_0_8px_rgba(24,186,96,0.4)]"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>

        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-black flex items-center gap-2">
          <span className="w-2 h-2 bg-[#18ba60] rounded-full animate-ping"></span>
          Preparing POS environment...
        </div>
      </div>
    </div>
  );
};
