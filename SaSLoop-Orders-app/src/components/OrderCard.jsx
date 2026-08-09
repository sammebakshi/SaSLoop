import React, { useState } from 'react';
import { 
  Phone, MapPin, Clock, ShoppingBag, Bike, Check, X, Navigation, ExternalLink, UtensilsCrossed, Monitor, FileText, ChevronDown, CheckCircle2, XCircle, AlertCircle
} from 'lucide-react';

const OrderCard = ({ 
  order, 
  onUpdateStatus, 
  onUpdatePaymentStatus, 
  onCancelRequest, 
  isDarkMode,
  riders = [],
  waiters = [],
  onAssignRider,
  onAssignWaiter,
  onUpdateDeliveryCharge
}) => {
  const [showPaymentMenu, setShowPaymentMenu] = useState(false);
  const [deliveryChargeInput, setDeliveryChargeInput] = useState(order.delivery_charge || 0);
  const refId = order.order_reference || order.bill_no || order.bill_number || (order.id ? `ORD-${order.id}` : 'N/A');
  const status = String(order.status || 'PENDING').toUpperCase();
  const paymentStatus = String(order.payment_status || 'PENDING').toUpperCase();
  const isCOD = order.payment_method === 'COD' || order.is_cod;

  // Payment Status Flags
  const isCustomerClaimed = paymentStatus.includes('CUSTOMER') || paymentStatus.includes('CLAIM') || paymentStatus === 'ONLINE_PAID_CLAIMED' || paymentStatus === 'CLAIMED_PAID' || paymentStatus === 'CUSTOMER_CONFIRMED';
  const isPaymentVerified = paymentStatus === 'RECEIVED' || paymentStatus === 'PAID' || paymentStatus === 'VERIFIED';
  const isPaymentNotReceived = paymentStatus === 'NOT_RECEIVED' || paymentStatus === 'UNPAID';
  const isInteractivePayment = isCustomerClaimed || isPaymentVerified || isPaymentNotReceived;

  // Order Type & Channel Source
  const rawOrdType = String(order.order_type || '').toUpperCase();
  const addressText = order.address || order.delivery_address || '';
  const rawSource = String(order.source || '').toUpperCase();
  const hasTable = order.table_number && String(order.table_number) !== "0" && String(order.table_number) !== "";

  const isPickup = rawOrdType.includes('PICKUP') || rawOrdType.includes('TAKEAWAY') || addressText.toLowerCase() === 'pickup';
  const isDineIn = hasTable || rawOrdType.includes('DINE');
  const isDelivery = !isPickup && !isDineIn && (rawOrdType.includes('DELIVERY') || addressText.includes('http') || addressText.includes('Pin:') || addressText.includes('Location') || (rawSource.includes('WHATSAPP') && addressText.toLowerCase() !== 'pickup'));
  const isPOS = rawSource.includes('POS') && !isDelivery && !isPickup && !isDineIn;

  // Calculate elapsed time in minutes
  const createdAt = order.created_at || order.date || order.created_time;
  let elapsedMinutes = 0;
  if (createdAt) {
    const diff = Math.floor((new Date() - new Date(createdAt)) / 60000);
    elapsedMinutes = diff > 0 ? diff : 0;
  }

  // Parse items
  let items = [];
  try {
    if (Array.isArray(order.items)) {
      items = order.items;
    } else if (typeof order.items === 'string') {
      items = JSON.parse(order.items);
    }
  } catch (e) {
    items = [];
  }

  // Google Maps Navigation URL
  let mapUrl = order.location_url || order.map_url || '';
  if (!mapUrl && addressText && (isDelivery || addressText.includes('http') || addressText.includes('Pin:'))) {
    const urlMatch = addressText.match(/(https?:\/\/[^\s]+)/);
    if (urlMatch) {
      mapUrl = urlMatch[0];
    } else if (addressText.toLowerCase() !== 'pickup' && addressText.toLowerCase() !== 'pos') {
      mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressText)}`;
    }
  }

  // Card Styling based on Theme and Status
  let borderGlowClass = isDarkMode ? "border-slate-800 bg-slate-900/95 text-slate-100" : "border-slate-200 bg-white text-slate-950 shadow-md";
  if (status.includes('PENDING') || status.includes('AWAITING') || status.includes('PLACED')) {
    borderGlowClass += " border-emerald-500/50 shadow-lg shadow-emerald-500/10 animate-udm-pulse";
  }

  const getStatusBadge = () => {
    if (status.includes('CANCEL')) {
      return (
        <span className="bg-rose-500/10 border border-rose-500/30 text-rose-500 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
          ✖ CANCELLED
        </span>
      );
    }
    if (status.includes('COMPLET')) {
      return (
        <span className="bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
          ✔ COMPLETED
        </span>
      );
    }
    if (status.includes('DISPATCH') || status.includes('READY')) {
      return (
        <span className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
          🚀 READY / DISPATCHED
        </span>
      );
    }
    if (status.includes('PROCESS') || status.includes('PREPAR') || status.includes('KITCHEN')) {
      return (
        <span className="bg-cyan-500/15 border border-cyan-500/40 text-cyan-600 dark:text-cyan-400 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider animate-pulse">
          👨‍🍳 PREPARING IN KITCHEN
        </span>
      );
    }
    if (status.includes('AWAITING_CUSTOMER')) {
      return (
        <span className="bg-amber-500/15 border border-amber-500/40 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
          ⏳ AWAITING CUSTOMER CONFIRMATION
        </span>
      );
    }
    if (status.includes('AWAITING_DELIVERY') || status.includes('PENDING_DELIVERY_CHARGE')) {
      return (
        <span className="bg-blue-500/15 border border-blue-500/40 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider animate-pulse">
          🚚 AWAITING DELIVERY FEE
        </span>
      );
    }
    return (
      <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-wider shadow-md">
        🔥 NEW PENDING
      </span>
    );
  };

  const getChannelBadge = () => {
    if (isDineIn) {
      return (
        <span className="bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-md text-[10px] font-black flex items-center gap-1">
          <UtensilsCrossed size={11} /> DINE-IN {order.table_number ? `(T-${order.table_number})` : ''}
        </span>
      );
    }
    if (isDelivery) {
      return (
        <span className="bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-md text-[10px] font-black flex items-center gap-1">
          <Bike size={11} /> DIRECT DELIVERY
        </span>
      );
    }
    if (isPickup) {
      return (
        <span className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md text-[10px] font-black flex items-center gap-1">
          <ShoppingBag size={11} /> TAKEAWAY / PICKUP
        </span>
      );
    }
    return (
      <span className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 px-2 py-0.5 rounded-md text-[10px] font-black flex items-center gap-1">
        <Monitor size={11} /> POS ORDER
      </span>
    );
  };

  const handleSelectPaymentStatus = (newPayStatus) => {
    setShowPaymentMenu(false);
    onUpdatePaymentStatus(order.id, newPayStatus);
  };

  return (
    <article className={`rounded-2xl p-4 space-y-3 border ${borderGlowClass} transition-all`}>
      {/* Header Banner */}
      <div className={`flex items-center justify-between border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} pb-2.5`}>
        <div className="flex items-center gap-2">
          {getChannelBadge()}
          <span className={`text-[10px] font-extrabold flex items-center gap-1 px-2 py-0.5 rounded-md border ${
            isDarkMode ? 'bg-slate-950 text-slate-400 border-slate-800' : 'bg-slate-100 text-slate-700 border-slate-200'
          }`}>
            <Clock size={11} className="text-emerald-600" />
            {elapsedMinutes > 0 ? `${elapsedMinutes} MIN AGO` : 'JUST NOW'}
          </span>
        </div>

        <div>{getStatusBadge()}</div>
      </div>

      {/* Order Ref & Payment Row */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`font-black text-lg tracking-tight flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
            <span>{refId}</span>
          </h3>
        </div>

        {/* Interactive Payment Status Badge & Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => setShowPaymentMenu(!showPaymentMenu)}
            type="button"
            className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all active:scale-95 border ${
              isPaymentVerified
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-400'
                : isPaymentNotReceived
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-700 dark:text-rose-400'
                : isCustomerClaimed
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-800 dark:text-amber-300 animate-pulse'
                : isCOD
                ? 'bg-blue-500/15 border-blue-500/40 text-blue-700 dark:text-blue-400'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <span>
              {isPaymentVerified
                ? '🟢 PAID: RECEIVED'
                : isPaymentNotReceived
                ? '🔴 NOT RECEIVED'
                : isCustomerClaimed
                ? '💳 CUSTOMER CLAIMED ONLINE PAID'
                : isCOD
                ? '💵 CASH ON DELIVERY'
                : '⏳ ONLINE PAYMENT PENDING'}
            </span>
            <ChevronDown size={12} />
          </button>

          {/* Payment Verification Dropdown Menu */}
          {showPaymentMenu && (
            <div className={`absolute right-0 top-8 z-30 w-52 rounded-xl border p-1.5 shadow-2xl space-y-1 ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2 py-1 border-b border-slate-800">
                Change Payment Status:
              </div>

              <button
                onClick={() => handleSelectPaymentStatus('RECEIVED')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-black text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 size={14} />
                <span>✅ PAYMENT RECEIVED</span>
              </button>

              <button
                onClick={() => handleSelectPaymentStatus('NOT_RECEIVED')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-black text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 flex items-center gap-1.5 cursor-pointer"
              >
                <XCircle size={14} />
                <span>❌ NOT RECEIVED</span>
              </button>

              <button
                onClick={() => handleSelectPaymentStatus('CUSTOMER_CONFIRMED')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-black text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 flex items-center gap-1.5 cursor-pointer"
              >
                <AlertCircle size={14} />
                <span>🟡 CUSTOMER CLAIMED PAID</span>
              </button>

              <button
                onClick={() => handleSelectPaymentStatus('PENDING')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-black text-slate-600 dark:text-slate-400 hover:bg-slate-500/10 flex items-center gap-1.5 cursor-pointer"
              >
                <Clock size={14} />
                <span>⏳ ONLINE PAYMENT PENDING</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Prominent Payment & Cancellation Status Banner */}
      {(() => {
        const oStatus = String(order.status || '').toUpperCase();
        const pStatus = String(order.payment_status || 'PENDING').toUpperCase();
        
        if (oStatus.includes('CANCEL')) {
          return (
            <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-600 dark:text-rose-400 text-xs font-black flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span>✖</span>
                <span>ORDER CANCELLED BY RESTAURANT</span>
              </span>
              {(order.rejection_reason || order.reason) && (
                <span className="text-[10px] font-semibold opacity-90 truncate max-w-[150px]">({order.rejection_reason || order.reason})</span>
              )}
            </div>
          );
        }

        if (pStatus === 'RECEIVED' || pStatus === 'PAID' || pStatus === 'VERIFIED') {
          return (
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-400 text-xs font-black flex items-center gap-2">
              <span>🟢</span>
              <span>ONLINE PAYMENT: VERIFIED & RECEIVED ✅</span>
            </div>
          );
        }

        if (pStatus === 'NOT_RECEIVED' || pStatus === 'UNPAID') {
          return (
            <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-700 dark:text-rose-400 text-xs font-black flex items-center gap-2">
              <span>🔴</span>
              <span>ONLINE PAYMENT: NOT RECEIVED ❌</span>
            </div>
          );
        }

        if (pStatus.includes('CUSTOMER') || pStatus.includes('CLAIM')) {
          return (
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-800 dark:text-amber-300 text-xs font-black flex items-center gap-2 animate-pulse">
              <span>🟡</span>
              <span>PAYMENT CLAIMED BY CUSTOMER — AWAITING STAFF VERIFICATION</span>
            </div>
          );
        }

        return null;
      })()}

      {/* Customer & Address Details */}
      <div className={`rounded-xl p-3 space-y-2 border ${isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
        <div className="flex items-center justify-between">
          <span className={`font-extrabold text-xs truncate max-w-[200px] ${isDarkMode ? 'text-slate-200' : 'text-slate-950'}`}>
            👤 {order.customer_name || order.name || 'Walk-in Customer'}
          </span>

          {(order.customer_number || order.phone) && (
            <a
              href={`tel:${order.customer_number || order.phone}`}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black flex items-center gap-1 shadow-xs transition-all active:scale-95"
            >
              <Phone size={11} /> CALL CUSTOMER
            </a>
          )}
        </div>

        {/* Address & Navigation */}
        {isDelivery && addressText && (
          <div className={`space-y-1.5 pt-1 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <p className={`text-[11px] font-medium flex items-start gap-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>
              <MapPin size={13} className="text-emerald-600 shrink-0 mt-0.5" />
              <span className="line-clamp-2">{addressText}</span>
            </p>

            {mapUrl && (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-extrabold shadow-xs transition-all cursor-pointer"
              >
                <Navigation size={12} />
                <span>MAPS NAVIGATION</span>
                <ExternalLink size={10} />
              </a>
            )}
          </div>
        )}

        {/* Special Instructions Note */}
        {order.notes && (
          <div className="bg-amber-500/15 border border-amber-500/30 rounded-lg p-2 text-amber-800 dark:text-amber-300 text-[11px] font-semibold flex items-start gap-1.5">
            <FileText size={13} className="shrink-0 mt-0.5" />
            <span>Note: {order.notes}</span>
          </div>
        )}

        {/* 🚴 Rider Assignment Dropdown for Delivery Orders */}
        {isDelivery && (
          <div className={`pt-2 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <label className={`text-[10px] font-black uppercase tracking-wider block mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>
              🚴 ASSIGN DELIVERY BOY:
            </label>
            <select
              value={order.rider_id || ''}
              onChange={(e) => onAssignRider && onAssignRider(order.id, e.target.value)}
              className={`w-full p-2.5 rounded-xl text-xs font-bold border outline-none ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
              }`}
            >
              <option value="">-- Select Delivery Boy --</option>
              {riders.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name || r.full_name} {r.phone ? `(${r.phone})` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 🤵 Waiter Assignment Dropdown for Dine-In & Pickup Orders */}
        {(isDineIn || isPickup) && (
          <div className={`pt-2 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <label className={`text-[10px] font-black uppercase tracking-wider block mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>
              🤵 ASSIGN WAITER / STAFF:
            </label>
            <select
              value={order.waiter_id || ''}
              onChange={(e) => {
                const selObj = waiters.find(w => String(w.id) === String(e.target.value));
                onAssignWaiter && onAssignWaiter(order.id, e.target.value, selObj?.name || '');
              }}
              className={`w-full p-2.5 rounded-xl text-xs font-bold border outline-none ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
              }`}
            >
              <option value="">-- Select Waiter / Staff --</option>
              {waiters.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name || w.full_name} {w.role ? `(${w.role})` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 🚚 Delivery Charge Edit & WhatsApp Confirmation Action */}
        {isDelivery && (
          <div className={`p-2.5 rounded-xl border space-y-2 ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-black uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>
                🚚 DELIVERY CHARGE:
              </span>
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                ₹{parseFloat(order.delivery_charge || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                step="1"
                value={deliveryChargeInput}
                onChange={(e) => setDeliveryChargeInput(e.target.value)}
                placeholder="Delivery Fee"
                className={`w-28 p-2 rounded-xl text-xs font-bold border outline-none ${
                  isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
              <button
                type="button"
                onClick={() => onUpdateDeliveryCharge && onUpdateDeliveryCharge(order.id, parseFloat(deliveryChargeInput || 0))}
                className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-[10px] uppercase tracking-wider shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <span>CONFIRM & SEND WHATSAPP 💬</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Itemized Order Matrix */}
      <div className="space-y-1.5">
        <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>
          ITEMIZED ORDER LIST:
        </span>
        <div className="space-y-1">
          {items.length > 0 ? (
            items.map((item, idx) => (
              <div key={idx} className={`flex items-center justify-between text-xs font-semibold px-3 py-2 rounded-xl border ${
                isDarkMode ? 'bg-slate-950/60 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-950'
              }`}>
                <span className="truncate pr-2 flex items-center gap-2">
                  <span className="bg-emerald-600 text-white font-black px-1.5 py-0.5 rounded-md text-[11px]">
                    {item.qty || item.quantity || 1}x
                  </span>
                  <span>{item.name || item.product_name}</span>
                </span>
                <span className={`font-bold shrink-0 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
                  ₹{((item.qty || 1) * (item.price || 0)).toFixed(2)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 italic px-2">{order.items_summary || 'Standard Order Items'}</p>
          )}
        </div>
      </div>

      {/* Bill Total Footer */}
      <div className={`flex items-center justify-between pt-2 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>
          TOTAL AMOUNT:
        </span>
        <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
          ₹{parseFloat(order.total_price || order.total_amount || order.total || order.amount || 0).toFixed(2)}
        </span>
      </div>

      {/* Emerald One-Tap Action Buttons */}
      {!status.includes('CANCEL') && !status.includes('COMPLET') && (
        <div className="flex items-center gap-2 pt-2">
          {(status.includes('PENDING') || status.includes('AWAITING') || status.includes('PLACED')) && (
            <>
              <button
                onClick={() => onUpdateStatus(order.id, 'PROCESSING')}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Check size={16} /> ACCEPT ORDER (15 MIN)
              </button>

              <button
                onClick={() => onCancelRequest(order)}
                className={`py-3 px-4 rounded-xl font-extrabold text-xs transition-colors cursor-pointer border ${
                  isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-rose-400' : 'bg-slate-100 border-slate-300 text-slate-800 hover:text-rose-600'
                }`}
                title="Reject Order"
              >
                <X size={16} />
              </button>
            </>
          )}

          {(status.includes('PROCESS') || status.includes('PREPAR') || status.includes('KITCHEN')) && (
            <>
              <button
                onClick={() => onUpdateStatus(order.id, 'DISPATCHED')}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Bike size={16} /> MARK READY / DISPATCH
              </button>

              <button
                onClick={() => onUpdateStatus(order.id, 'COMPLETED')}
                className="py-3 px-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs transition-colors cursor-pointer shadow-xs"
              >
                COMPLETE
              </button>
            </>
          )}

          {status.includes('DISPATCH') && (
            <button
              onClick={() => onUpdateStatus(order.id, 'COMPLETED')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Check size={16} /> MARK DELIVERED / COMPLETED
            </button>
          )}
        </div>
      )}
    </article>
  );
};

export default OrderCard;
