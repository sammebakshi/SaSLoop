import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, ChefHat, CheckCircle2, Bike, MapPin } from 'lucide-react';
import API_BASE from '../config';

const TrackOrder = () => {
    const { orderRef } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch order logic. For MVP, we will simulate fetching or fetch from a public endpoint if we had one.
        // To make it fully functional, we would need a public endpoint `/api/public/order/:orderRef`.
        const fetchOrder = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/public/order/${orderRef}`);
                if (res.ok) {
                    const data = await res.json();
                    setOrder(data);
                } else {
                    setOrder({ error: "Order not found" });
                }
            } catch (err) {
                setOrder({ error: "Failed to connect" });
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
        
        // Poll every 10 seconds
        const interval = setInterval(fetchOrder, 10000);
        return () => clearInterval(interval);
    }, [orderRef]);

    if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-black animate-pulse">FINDING ORDER...</div>;
    
    if (order?.error) return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-6 text-center">
            <h1 className="text-4xl font-black mb-2 italic text-rose-500 tracking-tighter">Oops!</h1>
            <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">{order.error}</p>
        </div>
    );

    // Dynamic UI based on status
    const statusMap = {
        'PENDING': { icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/20', text: 'Waiting for Kitchen', step: 1 },
        'PREPARING': { icon: ChefHat, color: 'text-blue-500', bg: 'bg-blue-500/20', text: 'Cooking in Progress', step: 2 },
        'READY': { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/20', text: 'Ready for Pickup/Delivery', step: 3 },
        'DELIVERED': { icon: MapPin, color: 'text-indigo-500', bg: 'bg-indigo-500/20', text: 'Delivered', step: 4 }
    };

    const currentStatus = statusMap[order.status?.toUpperCase()] || statusMap['PENDING'];
    const StatusIcon = currentStatus.icon;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-64 bg-slate-900 rounded-b-[3rem]"></div>
            
            <div className="relative z-10 p-8 pt-16 flex flex-col h-full">
                <div className="text-center mb-10 text-white">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-2">Live Tracking</p>
                    <h1 className="text-4xl font-black tracking-tighter italic">Order {orderRef}</h1>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 mb-6 relative overflow-hidden">
                    <div className="flex flex-col items-center text-center">
                        <div className={`w-24 h-24 rounded-full ${currentStatus.bg} ${currentStatus.color} flex items-center justify-center mb-6 animate-pulse`}>
                            <StatusIcon className="w-12 h-12" />
                        </div>
                        <h2 className={`text-2xl font-black uppercase tracking-tighter italic ${currentStatus.color}`}>
                            {currentStatus.text}
                        </h2>
                        {currentStatus.step === 2 && (
                            <p className="text-xs font-bold text-slate-400 mt-2 tracking-widest uppercase">ETA: ~12 Mins</p>
                        )}
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 mt-auto">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Order Summary</h3>
                    <div className="space-y-3">
                        {order.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm font-bold text-slate-700">
                                <span>{item.qty}x {item.name}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total</span>
                        <span className="text-xl font-black text-slate-900 tracking-tighter">₹{order.total_price}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackOrder;
