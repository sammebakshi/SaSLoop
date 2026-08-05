import React from 'react';
import { Volume2, CheckCircle, BellRing } from 'lucide-react';

const SoundAlertBanner = ({ count, type, onAcknowledge }) => {
  if (count <= 0) return null;

  return (
    <div className="fixed top-16 left-3 right-3 z-50 bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 text-white p-3.5 rounded-2xl shadow-2xl border border-orange-400/40 flex items-center justify-between animate-ring-pulse">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-white/20 backdrop-blur-xs">
          <BellRing size={22} className="animate-spin text-white" />
        </div>
        <div>
          <h3 className="font-extrabold text-sm tracking-tight leading-none">
            {count} New {type === 'reservation' ? 'Table Booking' : 'Order'}{count > 1 ? 's' : ''} Received!
          </h3>
          <p className="text-[11px] text-orange-100 font-medium mt-1">
            Sound chime active. Tap acknowledge to silence.
          </p>
        </div>
      </div>

      <button
        onClick={onAcknowledge}
        className="px-3.5 py-2 rounded-xl bg-white text-orange-600 font-black text-xs shadow-lg hover:bg-orange-50 active:scale-95 transition-all cursor-pointer flex items-center gap-1 shrink-0"
      >
        <CheckCircle size={14} />
        <span>Silence Alert</span>
      </button>
    </div>
  );
};

export default SoundAlertBanner;
