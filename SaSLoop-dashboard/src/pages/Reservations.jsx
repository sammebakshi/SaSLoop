import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, Check, X, Loader } from 'lucide-react';
import API_BASE from '../config';

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReservations = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const res = await fetch(`${API_BASE}/api/reservations`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setReservations(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
        const interval = setInterval(fetchReservations, 30000);
        return () => clearInterval(interval);
    }, []);

    const updateStatus = async (id, status) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const res = await fetch(`${API_BASE}/api/reservations/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                fetchReservations();
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-8 flex justify-center"><Loader className="animate-spin text-slate-400" /></div>;

    const pending = reservations.filter(r => r.status === 'pending');
    const confirmed = reservations.filter(r => r.status === 'confirmed');

    const renderCard = (res) => (
        <div key={res.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
            <div>
                <h3 className="font-bold text-lg text-slate-800">{res.customer_name}</h3>
                <p className="text-sm text-slate-500 mb-3">{res.customer_number}</p>
                <div className="flex gap-4 text-sm font-semibold text-slate-600">
                    <span className="flex items-center gap-1"><Calendar size={14} className="text-indigo-500"/> {new Date(res.reservation_date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Clock size={14} className="text-orange-500"/> {res.reservation_time}</span>
                    <span className="flex items-center gap-1"><Users size={14} className="text-emerald-500"/> {res.guests} Guests</span>
                </div>
            </div>
            {res.status === 'pending' && (
                <div className="flex gap-2">
                    <button onClick={() => updateStatus(res.id, 'confirmed')} className="p-3 bg-emerald-100 text-emerald-600 rounded-xl hover:bg-emerald-200 transition-colors">
                        <Check size={20} />
                    </button>
                    <button onClick={() => updateStatus(res.id, 'cancelled')} className="p-3 bg-rose-100 text-rose-600 rounded-xl hover:bg-rose-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>
            )}
            {res.status === 'confirmed' && (
                <span className="px-4 py-2 bg-emerald-50 text-emerald-600 font-bold text-xs uppercase tracking-wider rounded-lg border border-emerald-200">
                    Confirmed
                </span>
            )}
        </div>
    );

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Table Reservations</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage AI and manual bookings.</p>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Action Required ({pending.length})</h2>
                {pending.length === 0 ? <p className="text-slate-400 italic">No pending reservations.</p> : pending.map(renderCard)}
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-200">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Upcoming ({confirmed.length})</h2>
                {confirmed.length === 0 ? <p className="text-slate-400 italic">No upcoming reservations.</p> : confirmed.map(renderCard)}
            </div>
        </div>
    );
};

export default Reservations;
