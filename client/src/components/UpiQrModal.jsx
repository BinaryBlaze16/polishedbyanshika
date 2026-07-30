import React, { useState } from 'react';
import { X, Copy, Check, Upload, CheckCircle2 } from 'lucide-react';
import { formatINR } from '../utils/formatCurrency';
import { showSuccess, showError } from './Toast';

const UpiQrModal = ({ isOpen, onClose, total, orderId, onPaymentSubmit }) => {
  const [utr, setUtr] = useState('');
  const [copied, setCopied] = useState(false);
  const upiId = "polishedbyanshika@upi";

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (utr.trim().length < 12) {
      showError("Please enter a valid 12-digit UTR number");
      return;
    }
    onPaymentSubmit(utr);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white border border-rose-200 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-rose-100 bg-black/20">
          <h2 className="text-xl font-medium text-dark-800">Complete Payment</h2>
          <button onClick={onClose} className="text-dark-400 hover:text-dark-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Amount */}
          <div className="text-center space-y-1">
            <p className="text-dark-400 text-sm">Amount to pay</p>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              {formatINR(total)}
            </p>
            {orderId && <p className="text-xs text-gray-500">Order ID: {orderId}</p>}
          </div>

          {/* QR Code Placeholder */}
          <div className="mx-auto w-48 h-48 bg-white rounded-xl flex items-center justify-center p-2 shadow-inner">
            <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 gap-2">
              <span className="text-4xl">📱</span>
              <span className="text-xs font-medium text-center">Scan with any<br/>UPI App</span>
            </div>
            {/* In real app: <img src={qrUrl} alt="UPI QR" className="w-full h-full object-contain" /> */}
          </div>

          {/* UPI ID */}
          <div className="bg-black/30 rounded-xl p-3 border border-white/5 flex items-center justify-between">
            <div className="overflow-hidden">
              <p className="text-xs text-dark-400 mb-1">UPI ID</p>
              <p className="text-dark-800 text-sm font-medium truncate">{upiId}</p>
            </div>
            <button 
              onClick={handleCopy}
              className="ml-2 p-2 rounded-lg bg-white hover:bg-white/10 text-dark-400 transition-colors"
            >
              {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-rose-100">
            <div>
              <label className="block text-sm font-medium text-dark-400 mb-1">
                Enter UTR / Reference No. <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="12-digit UPI Reference Number"
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                className="w-full bg-[#FDF8F4] border border-rose-200 rounded-xl px-4 py-3 text-dark-800 placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-semibold py-3 rounded-xl shadow-lg shadow-yellow-500/20 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={18} />
              Confirm Payment
            </button>
          </form>

          <div className="text-center">
            <p className="text-xs text-gray-500 mt-2">
              Your order will be confirmed within 2-4 hours after payment verification.
              Need help? WhatsApp <span className="text-dark-400">+91 6394802184</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpiQrModal;
