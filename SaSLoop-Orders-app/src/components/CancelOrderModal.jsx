import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

const CancelOrderModal = ({ isOpen, orderRef, onClose, onConfirm, isDarkMode }) => {
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  if (!isOpen) return null;

  const predefinedReasons = [
    'Item Out of Stock',
    'Kitchen Too Busy',
    'Customer Requested Cancellation',
    'Outside Delivery Radius',
    'Other Reason'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalReason = reason === 'Other Reason' ? customReason : (reason || 'Order cancelled by management');
    onConfirm(finalReason);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className={`w-full max-w-md rounded-3xl p-5 space-y-4 shadow-2xl border ${
        isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className={`flex items-center justify-between border-b pb-3 ${isDarkMode ? 'border-zinc-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-2 text-red-500">
            <AlertTriangle size={20} />
            <h3 className={`font-extrabold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Cancel Order {orderRef}</h3>
          </div>
          <button onClick={onClose} className={`p-1 ${isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className={`text-xs font-semibold ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
            Please select or enter the cancellation reason. The customer will receive this reason on WhatsApp.
          </p>

          <div className="space-y-2">
            {predefinedReasons.map((r) => (
              <label
                key={r}
                className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                  reason === r
                    ? 'bg-red-500/10 border-red-500 text-red-500'
                    : isDarkMode
                      ? 'bg-zinc-800/60 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="cancellation_reason"
                  value={r}
                  checked={reason === r}
                  onChange={(e) => setReason(e.target.value)}
                  className="accent-red-500"
                />
                <span>{r}</span>
              </label>
            ))}
          </div>

          {reason === 'Other Reason' && (
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Specify exact cancellation reason..."
              required
              className={`w-full p-3 rounded-xl text-xs font-medium border outline-none min-h-[70px] ${
                isDarkMode
                  ? 'bg-zinc-950 border-zinc-800 text-white focus:border-red-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-red-500'
              }`}
            />
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-extrabold hover:bg-zinc-700 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={!reason}
              className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black shadow-lg disabled:opacity-50 transition-all"
            >
              Confirm Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CancelOrderModal;
