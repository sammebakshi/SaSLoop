import React, { useState, useEffect, useRef } from 'react';
import { Search, RefreshCw, Calendar, Armchair } from 'lucide-react';
import { reservationService } from '../services/api';
import ReservationCard from '../components/ReservationCard';

const Reservations = ({ activeOutlet, onNewReservationAlert, isDarkMode }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const seenResIdsRef = useRef(new Set());
  const initialLoadRef = useRef(true);

  const fetchReservations = async () => {
    try {
      const data = await reservationService.getReservations(activeOutlet?.id);
      let list = Array.isArray(data) ? data : (data.reservations || []);
      
      list.sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date));

      const newPending = list.filter(r => {
        const isNew = !seenResIdsRef.current.has(r.id);
        const isPending = String(r.status || '').toUpperCase().includes('PENDING');
        return isNew && isPending;
      });

      if (newPending.length > 0) {
        newPending.forEach(r => seenResIdsRef.current.add(r.id));
        onNewReservationAlert(newPending.length);
      }

      setReservations(list);
    } catch (e) {
      console.error('Fetch reservations error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
    const interval = setInterval(fetchReservations, 3000);
    return () => clearInterval(interval);
  }, [activeOutlet?.id]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await reservationService.updateStatus(id, newStatus);
      fetchReservations();
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to update reservation status');
    }
  };

  const filteredReservations = reservations.filter((r) => {
    const s = String(r.status || '').toUpperCase();
    const matchSearch =
      (r.reservation_ref && r.reservation_ref.toLowerCase().includes(search.toLowerCase())) ||
      (r.customer_name && r.customer_name.toLowerCase().includes(search.toLowerCase())) ||
      (r.customer_phone && r.customer_phone.includes(search)) ||
      (r.customer_number && r.customer_number.includes(search));

    if (!matchSearch) return false;

    if (filter === 'PENDING') return s.includes('PENDING');
    if (filter === 'CONFIRMED') return s.includes('CONFIRM') || s.includes('ACCEPT');
    if (filter === 'DECLINED') return s.includes('REJECT') || s.includes('DECLINE') || s.includes('CANCEL');
    return true;
  });

  const counts = {
    all: reservations.length,
    pending: reservations.filter(r => String(r.status || '').toUpperCase().includes('PENDING')).length,
    confirmed: reservations.filter(r => String(r.status || '').toUpperCase().includes('CONFIRM')).length,
    declined: reservations.filter(r => String(r.status || '').toUpperCase().includes('REJECT') || String(r.status || '').toUpperCase().includes('DECLINE')).length,
  };

  return (
    <div className="pb-24 pt-4 px-4 space-y-4">
      {/* Search & Refresh Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search booking ref, customer, phone..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs font-semibold outline-none transition-colors ${
              isDarkMode
                ? 'bg-zinc-900 border border-zinc-800 text-white focus:border-orange-500'
                : 'bg-slate-100 border border-slate-200 text-slate-900 focus:border-emerald-500'
            }`}
          />
        </div>
        <button
          onClick={fetchReservations}
          className={`p-2.5 rounded-2xl border transition-colors cursor-pointer ${
            isDarkMode
              ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
          }`}
          title="Refresh Feed"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'ALL', label: 'All', count: counts.all },
          { id: 'PENDING', label: 'Pending Review', count: counts.pending },
          { id: 'CONFIRMED', label: 'Confirmed', count: counts.confirmed },
          { id: 'DECLINED', label: 'Declined', count: counts.declined },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              filter === t.id
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : isDarkMode
                  ? 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                  : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>{t.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              filter === t.id
                ? 'bg-white/20 text-white'
                : isDarkMode
                  ? 'bg-zinc-800 text-zinc-300'
                  : 'bg-slate-200 text-slate-700'
            }`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Reservations Feed */}
      {loading && reservations.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`}>Loading Table Bookings...</p>
        </div>
      ) : filteredReservations.length === 0 ? (
        <div className={`py-16 text-center space-y-2 rounded-3xl border p-6 ${
          isDarkMode ? 'bg-zinc-900/50 border-zinc-850' : 'bg-slate-50 border-slate-200 shadow-sm'
        }`}>
          <Armchair size={32} className={`mx-auto ${isDarkMode ? 'text-zinc-600' : 'text-slate-400'}`} />
          <h3 className={`font-extrabold text-sm ${isDarkMode ? 'text-zinc-300' : 'text-slate-800'}`}>No {filter !== 'ALL' ? filter.toLowerCase() : ''} bookings found</h3>
          <p className={`text-xs max-w-xs mx-auto ${isDarkMode ? 'text-zinc-500' : 'text-slate-500'}`}>
            Table booking requests from WhatsApp and Online menu will appear here with an alert.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredReservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onUpdateStatus={handleUpdateStatus}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Reservations;
