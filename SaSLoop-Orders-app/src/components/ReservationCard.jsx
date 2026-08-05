import React from 'react';
import { Calendar, Clock, Users, MapPin, Phone, Check, X, Armchair } from 'lucide-react';

const ReservationCard = ({ reservation, onUpdateStatus, isDarkMode }) => {
  const ref = reservation.reservation_ref || `RES-${reservation.id}`;
  const status = String(reservation.status || 'PENDING').toUpperCase();

  const getStatusBadge = () => {
    if (status.includes('CONFIRM') || status.includes('ACCEPT')) {
      return <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 px-2.5 py-1 rounded-full text-[10px] font-black uppercase">Confirmed ✅</span>;
    }
    if (status.includes('REJECT') || status.includes('DECLINE') || status.includes('CANCEL')) {
      return <span className="bg-red-500/10 border border-red-500/30 text-red-500 px-2.5 py-1 rounded-full text-[10px] font-black uppercase">Declined ❌</span>;
    }
    return <span className="bg-amber-500/20 border border-amber-500/50 text-amber-500 px-2.5 py-1 rounded-full text-[10px] font-black uppercase animate-bounce">Pending Review ⏳</span>;
  };

  return (
    <article className={`rounded-3xl p-4 space-y-3.5 border transition-all ${
      isDarkMode
        ? 'bg-zinc-900 border-zinc-800/90 text-white shadow-xl hover:border-zinc-700'
        : 'bg-white border-slate-200 text-slate-900 shadow-md hover:shadow-lg hover:border-slate-300'
    }`}>
      {/* Header Row */}
      <div className={`flex items-center justify-between border-b pb-3 ${isDarkMode ? 'border-zinc-800/80' : 'border-slate-100'}`}>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-500 font-extrabold text-xs">
            <Armchair size={16} />
          </div>
          <div>
            <h3 className={`font-extrabold text-base leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{ref}</h3>
            <p className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
              Table Booking Request
            </p>
          </div>
        </div>

        <div>{getStatusBadge()}</div>
      </div>

      {/* Customer & Guest Info */}
      <div className={`rounded-2xl p-3 space-y-2 border ${
        isDarkMode ? 'bg-zinc-950/60 border-zinc-850' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <span className={`font-extrabold text-xs truncate max-w-[180px] ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            👤 {reservation.customer_name || 'Guest'}
          </span>
          {reservation.customer_phone || reservation.customer_number ? (
            <a
              href={`tel:${reservation.customer_phone || reservation.customer_number}`}
              className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 text-[10px] font-black flex items-center gap-1 hover:bg-emerald-500/25 transition-colors"
            >
              <Phone size={10} /> Call Guest
            </a>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-semibold pt-1">
          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border ${
            isDarkMode ? 'bg-zinc-900/80 border-zinc-800 text-zinc-300' : 'bg-white border-slate-200 text-slate-700 shadow-2xs'
          }`}>
            <Users size={14} className="text-amber-500 shrink-0" />
            <span><strong>{reservation.guests_count || reservation.guests || 2}</strong> Guests</span>
          </div>

          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border ${
            isDarkMode ? 'bg-zinc-900/80 border-zinc-800 text-zinc-300' : 'bg-white border-slate-200 text-slate-700 shadow-2xs'
          }`}>
            <Armchair size={14} className="text-orange-500 shrink-0" />
            <span className="truncate">{reservation.seating_preference || 'Indoor'} Area</span>
          </div>
        </div>

        <div className={`flex items-center gap-2 text-xs font-semibold pt-1 ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
          <Calendar size={13} className={isDarkMode ? 'text-zinc-500' : 'text-slate-400'} />
          <span>{reservation.reservation_date || 'Today'}</span>
          <span>•</span>
          <Clock size={13} className={isDarkMode ? 'text-zinc-500' : 'text-slate-400'} />
          <span>{reservation.reservation_time || '7:00 PM'}</span>
        </div>

        {reservation.special_notes && (
          <p className="text-[11px] font-medium text-amber-700 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
            <strong>Notes:</strong> {reservation.special_notes}
          </p>
        )}
      </div>

      {/* 1-Tap Action Buttons */}
      {!status.includes('CONFIRM') && !status.includes('REJECT') && !status.includes('CANCEL') && (
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => onUpdateStatus(reservation.id, 'CONFIRMED')}
            className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Check size={14} /> Accept & Confirm Table
          </button>

          <button
            onClick={() => onUpdateStatus(reservation.id, 'REJECTED')}
            className={`py-3 px-4 rounded-2xl font-bold text-xs border transition-colors cursor-pointer ${
              isDarkMode
                ? 'bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border-zinc-700 hover:border-red-500/30'
                : 'bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 border-slate-200 hover:border-red-200'
            }`}
            title="Decline Table Booking"
          >
            <X size={14} /> Decline
          </button>
        </div>
      )}
    </article>
  );
};

export default ReservationCard;
