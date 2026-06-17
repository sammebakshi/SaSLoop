               </motion.div>
            )}
         </AnimatePresence>

         {/* COUPON SELECTION MODAL */}
         <AnimatePresence>
            {isCouponModalOpen && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
               >
                  <motion.div
                     initial={{ scale: 0.9, y: 20 }}
                     animate={{ scale: 1, y: 0 }}
                     exit={{ scale: 0.9, y: 20 }}
                     className={`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border transition-all ${
                        isDark ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-white border-slate-200 text-slate-800'
                     }`}
                  >
                     {/* Header */}
                     <div className={`p-5 flex justify-between items-center border-b ${
                        isDark ? 'bg-[#0d1117]/50 border-[#30363d]' : 'bg-slate-50 border-slate-100'
                     }`}>
                        <div className="flex items-center gap-2.5">
                           <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-500">
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                 <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                                 <path d="M13 5v2" />
                                 <path d="M13 17v2" />
                                 <path d="M13 11v2" />
                              </svg>
                           </div>
                           <div>
         
<truncated 10530 bytes>
            {isChargesModalOpen && (
               <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }} 
                  className=