                      {/* Customer Info Header Toolbar */}
                      <div className="flex justify-end gap-3 px-1 relative">
                        <button
                          onClick={() => {
                            if (!customerPhone) {
                              toast.error("Enter customer mobile to view loyalty points.");
                              return;
                            }
                            setShowLoyaltyPopup(prev => !prev);
                          }}
                          className={`transition-colors relative ${isDark ? 'text-gray-400 hover:text-white' : 'text-slate-700 hover:text-black'}`}
                          title="View Loyalty Points"
                        >
                          <Gift size={20} strokeWidth={2.5} />
                        </button>

                        {/* Loyalty Points Popup */}
                        {showLoyaltyPopup && (() => {
                          const loyaltyFullPhone = customerPhone ? (customerPhone.startsWith('+') ? customerPhone : customerCountryCode + customerPhone) : '';
                          const loyaltyCustomer = loyaltyFullPhone ? customerDb[loyaltyFullPhone] : null;
                          const pts = loyaltyCustomer ? (Number(loyaltyCustomer.points) || 0) : 0;
                          return (
                            <div className={`absolute top-8 right-0 z-50 rounded-xl shadow-2xl border p-3 min-w-[180px] ${
                              isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-slate-200'
                            }`}>
                              <div className="flex items-center gap-2 mb-1">
                                <Gift size={14} className="text-amber-500" />
                                <span className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Loyalty Points</span>
                              </div>
                              <div className={
<truncated 2592 bytes>