import React, { useState, useEffect, useRef } from 'react';
import { Search, RefreshCw, ShoppingBag, Flame, Utensils, Rocket, Layers, Trash2 } from 'lucide-react';
import { orderService, staffService } from '../services/api';
import OrderCard from '../components/OrderCard';
import CancelOrderModal from '../components/CancelOrderModal';

const Orders = ({ activeOutlet, onNewOrderAlert, onAcknowledgeAlerts, isDarkMode }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedOrderToCancel, setSelectedOrderToCancel] = useState(null);
  const [riders, setRiders] = useState([]);
  const [waiters, setWaiters] = useState([]);
  
  const seenOrderIdsRef = useRef(new Set());
  const initialLoadRef = useRef(true);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getOrders('', activeOutlet?.id);
      let list = Array.isArray(data) ? data : (data.orders || []);
      
      list.sort((a, b) => new Date(b.created_at || b.date || 0) - new Date(a.created_at || a.date || 0));

      if (initialLoadRef.current) {
        list.forEach(o => {
          const s = String(o.status || '').toUpperCase();
          seenOrderIdsRef.current.add(`${o.id}_${s}`);
        });
        initialLoadRef.current = false;
      } else {
        const newPending = list.filter(o => {
          const s = String(o.status || '').toUpperCase();
          const stateKey = `${o.id}_${s}`;
          const isNewState = !seenOrderIdsRef.current.has(stateKey);
          const isUnconfirmedQuote = s.includes('AWAITING_CUSTOMER') || s.includes('AWAITING_DELIVERY');
          const isPending = (s.includes('PENDING') || s.includes('AWAITING') || s.includes('PLACED') || s.includes('NEW') || s.includes('CONFIRMED')) && !isUnconfirmedQuote;
          const rawOrdType = String(o.order_type || '').toUpperCase();
          const rawSource = String(o.source || '').toUpperCase();
          const isPOSSale = rawSource.includes('POS') || o.is_pos || (o.terminal && String(o.terminal).trim() !== '') || (!rawSource.includes('WHATSAPP') && !rawSource.includes('ONLINE') && !rawSource.includes('DIGITAL') && !rawSource.includes('WEB') && rawOrdType !== 'DELIVERY');
          return isNewState && isPending && !isPOSSale;
        });

        if (newPending.length > 0) {
          newPending.forEach(o => {
            const s = String(o.status || '').toUpperCase();
            seenOrderIdsRef.current.add(`${o.id}_${s}`);
          });
          onNewOrderAlert(newPending.length);
        }
      }

      setOrders(list);
    } catch (e) {
      console.error('Fetch orders error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, [activeOutlet?.id]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const [rRes, wRes] = await Promise.all([
          staffService.getRiders().catch(() => []),
          staffService.getWaiters().catch(() => [])
        ]);
        setRiders(Array.isArray(rRes) ? rRes : (rRes.riders || rRes.waiters || []));
        setWaiters(Array.isArray(wRes) ? wRes : (wRes.waiters || wRes.staff || []));
      } catch (e) {}
    };
    fetchStaff();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      fetchOrders();
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to update order status');
    }
  };

  const handleUpdatePaymentStatus = async (orderId, paymentStatus) => {
    try {
      await orderService.updatePaymentStatus(orderId, paymentStatus);
      fetchOrders();
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to update payment status');
    }
  };

  const handleAssignRider = async (orderId, riderId) => {
    try {
      await orderService.assignRider(orderId, riderId);
      fetchOrders();
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to assign rider');
    }
  };

  const handleAssignWaiter = async (orderId, waiterId, waiterName) => {
    try {
      await orderService.assignWaiter(orderId, waiterId, waiterName);
      fetchOrders();
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to assign waiter');
    }
  };

  const handleUpdateDeliveryCharge = async (orderId, charge) => {
    try {
      await orderService.updateDeliveryCharge(orderId, charge);
      alert('Delivery charge updated! WhatsApp confirmation message sent to customer.');
      fetchOrders();
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to update delivery charge');
    }
  };

  const handleConfirmCancel = async (reason) => {
    if (!selectedOrderToCancel) return;
    try {
      await orderService.updateStatus(selectedOrderToCancel.id, 'CANCELLED', reason);
      setSelectedOrderToCancel(null);
      fetchOrders();
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to cancel order');
    }
  };

  // Robust Status Matching Functions
  const isPendingStatus = (s) => {
    const u = String(s || '').toUpperCase();
    return u.includes('PENDING') || u.includes('AWAITING') || u.includes('PLACED') || u.includes('NEW');
  };

  const isPreparingStatus = (s) => {
    const u = String(s || '').toUpperCase();
    return u.includes('PROCESS') || u.includes('PREPAR') || u.includes('KITCHEN') || u.includes('ACCEPT');
  };

  const isReadyStatus = (s) => {
    const u = String(s || '').toUpperCase();
    return u.includes('DISPATCH') || u.includes('READY') || u.includes('OUT_FOR_DELIVERY');
  };

  const isCompletedStatus = (s) => {
    const u = String(s || '').toUpperCase();
    return u.includes('COMPLET') || u.includes('DELIVERED');
  };

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      (o.id && String(o.id).toLowerCase().includes(search.toLowerCase())) ||
      (o.order_reference && String(o.order_reference).toLowerCase().includes(search.toLowerCase())) ||
      (o.customer_name && o.customer_name.toLowerCase().includes(search.toLowerCase())) ||
      (o.customer_number && o.customer_number.includes(search));

    if (!matchSearch) return false;

    if (filter === 'PENDING') return isPendingStatus(o.status);
    if (filter === 'PREPARING') return isPreparingStatus(o.status);
    if (filter === 'READY') return isReadyStatus(o.status);
    if (filter === 'COMPLETED') return isCompletedStatus(o.status);
    return true;
  });

  const counts = {
    all: orders.length,
    pending: orders.filter(o => isPendingStatus(o.status)).length,
    preparing: orders.filter(o => isPreparingStatus(o.status)).length,
    ready: orders.filter(o => isReadyStatus(o.status)).length,
    completed: orders.filter(o => isCompletedStatus(o.status)).length,
  };

  return (
    <div className="pb-24 pt-4 px-4 space-y-4 max-w-4xl mx-auto">
      {/* Accurate Live Metrics Cards */}
      <div className="grid grid-cols-4 gap-2">
        <div className={`rounded-2xl p-2.5 text-center border ${isDarkMode ? 'bg-slate-900/80 border-emerald-500/30' : 'bg-white border-emerald-200 shadow-sm'}`}>
          <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase">
            <Flame size={12} className="animate-bounce" />
            <span>NEW</span>
          </div>
          <p className={`text-xl font-black mt-0.5 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>{counts.pending}</p>
        </div>

        <div className={`rounded-2xl p-2.5 text-center border ${isDarkMode ? 'bg-slate-900/80 border-cyan-500/30' : 'bg-white border-cyan-200 shadow-sm'}`}>
          <div className="flex items-center justify-center gap-1 text-cyan-600 dark:text-cyan-400 text-[10px] font-black uppercase">
            <Utensils size={12} />
            <span>PREPARING</span>
          </div>
          <p className={`text-xl font-black mt-0.5 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>{counts.preparing}</p>
        </div>

        <div className={`rounded-2xl p-2.5 text-center border ${isDarkMode ? 'bg-slate-900/80 border-emerald-500/30' : 'bg-white border-emerald-200 shadow-sm'}`}>
          <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase">
            <Rocket size={12} />
            <span>READY</span>
          </div>
          <p className={`text-xl font-black mt-0.5 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>{counts.ready}</p>
        </div>

        <div className={`rounded-2xl p-2.5 text-center border ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className={`flex items-center justify-center gap-1 text-[10px] font-black uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>
            <Layers size={12} />
            <span>TOTAL</span>
          </div>
          <p className={`text-xl font-black mt-0.5 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>{counts.all}</p>
        </div>
      </div>

      {/* Search & Refresh Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order ref, customer, phone..."
            className={`w-full pl-10 pr-4 py-3 rounded-2xl ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-950 shadow-xs'
            } border text-xs font-semibold outline-none focus:border-emerald-500 transition-colors`}
          />
        </div>
        <button
          onClick={fetchOrders}
          className={`p-3 rounded-2xl ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-emerald-800 shadow-xs'
          } border hover:text-emerald-600 transition-colors cursor-pointer active:scale-95`}
          title="Refresh Feed"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Filter Tabs Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'ALL', label: 'All Orders', count: counts.all },
          { id: 'PENDING', label: '🔥 New Pending', count: counts.pending },
          { id: 'PREPARING', label: '👨‍🍳 Preparing', count: counts.preparing },
          { id: 'READY', label: '🚀 Ready / Dispatched', count: counts.ready },
          { id: 'COMPLETED', label: '📦 Completed', count: counts.completed },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
              filter === t.id
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                : isDarkMode
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 shadow-xs'
            }`}
          >
            <span>{t.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
              filter === t.id ? 'bg-white/20 text-white font-black' : isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-800'
            }`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Orders List Feed */}
      {loading && orders.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-black text-emerald-700 dark:text-slate-400 uppercase tracking-widest">LOADING LIVE ORDERS...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className={`py-16 text-center space-y-2 rounded-3xl p-6 border ${
          isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <ShoppingBag size={36} className="mx-auto text-emerald-600/50 dark:text-slate-600" />
          <h3 className={`font-extrabold text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-950'}`}>No {filter !== 'ALL' ? filter.toLowerCase() : ''} orders</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Live orders from Web, WhatsApp & POS will automatically appear here with alert sound.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onUpdateStatus={handleUpdateStatus}
              onUpdatePaymentStatus={handleUpdatePaymentStatus}
              onCancelRequest={(o) => setSelectedOrderToCancel(o)}
              isDarkMode={isDarkMode}
              riders={riders}
              waiters={waiters}
              onAssignRider={handleAssignRider}
              onAssignWaiter={handleAssignWaiter}
              onUpdateDeliveryCharge={handleUpdateDeliveryCharge}
            />
          ))}
        </div>
      )}

      {/* Cancel Order Reason Modal */}
      <CancelOrderModal
        isOpen={Boolean(selectedOrderToCancel)}
        orderRef={selectedOrderToCancel?.order_reference || selectedOrderToCancel?.bill_no || `ORD-${selectedOrderToCancel?.id}`}
        onClose={() => setSelectedOrderToCancel(null)}
        onConfirm={handleConfirmCancel}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default Orders;
