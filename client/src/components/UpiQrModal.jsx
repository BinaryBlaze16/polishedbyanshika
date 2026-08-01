import React, { useState, useEffect } from 'react';
import { X, Copy, Check, CheckCircle2 } from 'lucide-react';
import { formatINR } from '../utils/formatCurrency';
import { showSuccess, showError } from './Toast';
import api from '../services/api';

import usePublicSettings from '../hooks/usePublicSettings';

const UpiQrModal = ({ isOpen, onClose, total, orderId, onPaymentSubmit, upiId: customUpiId }) => {
  const { settings } = usePublicSettings();
  const [utr, setUtr] = useState('');
  const [copied, setCopied] = useState(false);
  const [upiId, setUpiId] = useState(
    customUpiId || import.meta.env.VITE_BUSINESS_UPI || "srivastavaanant39@oksbi"
  );

  useEffect(() => {
    if (isOpen) {
      api.get('/settings/public')
        .then(res => {
          const liveUpi = res.data?.data?.businessUpi || res.data?.businessUpi;
          if (liveUpi) {
            setUpiId(liveUpi);
          }
        })
        .catch(err => console.error("Could not fetch business UPI from settings", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentUpi = customUpiId || upiId;

  // Generate dynamic UPI Deep Link with exact order amount
  const upiPayUrl = `upi://pay?pa=${currentUpi}&pn=${encodeURIComponent(settings.businessName)}&am=${total}&cu=INR&tn=Order%20${orderId || ''}`;
  // Free high-quality QR code generator API
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiPayUrl)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUpi);
    setCopied(true);
    showSuccess("UPI ID copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (utr.trim().length < 12) {
      showError("Please enter a valid 12-digit UTR / Reference number");
      return;
    }
    onPaymentSubmit(utr);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white border border-rose-100 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-rose-100 bg-[#FDF8F4]">
          <div>
            <h2 className="text-xl font-bold font-display text-dark-800">Scan & Pay via UPI</h2>
            <p className="text-xs text-dark-400">Scan with GPay, PhonePe, Paytm or any UPI App</p>
          </div>
          <button onClick={onClose} className="p-2 text-dark-400 hover:text-dark-800 rounded-full bg-white border border-rose-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Amount Display */}
          <div className="text-center bg-rose-50/60 border border-rose-100 rounded-2xl p-4">
            <p className="text-xs text-dark-400 font-semibold uppercase tracking-wider">Exact Amount to Pay</p>
            <p className="text-3xl font-bold font-display text-rose-600 mt-0.5">
              {formatINR(total)}
            </p>
            {orderId && <p className="text-[11px] text-dark-400 font-mono mt-1">Order Ref: #{orderId}</p>}
          </div>

          {/* Dynamic QR Code */}
          <div className="mx-auto w-52 h-52 bg-white rounded-2xl p-3 border-2 border-rose-200 shadow-md flex items-center justify-center">
            <img 
              src={qrCodeImageUrl} 
              alt="Dynamic UPI QR Code" 
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          <p className="text-center text-xs text-dark-400 font-medium">
            ✨ Amount <strong className="text-dark-800">{formatINR(total)}</strong> & UPI ID are pre-filled in the QR code!
          </p>

          {/* UPI ID Copy Section */}
          <div className="bg-[#FDF8F4] rounded-2xl p-3.5 border border-rose-100 flex items-center justify-between">
            <div className="overflow-hidden">
              <p className="text-[10px] text-dark-400 font-bold uppercase tracking-wider">UPI ID / VPA</p>
              <p className="text-dark-800 text-sm font-bold truncate font-mono">{currentUpi}</p>
            </div>
            <button 
              onClick={handleCopy}
              className="ml-2 px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-500 hover:bg-rose-500 hover:text-white transition-all text-xs font-semibold flex items-center gap-1 shrink-0"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy ID"}
            </button>
          </div>

          {/* UTR Submission Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-3 border-t border-rose-100">
            <div>
              <label className="block text-xs font-bold text-dark-700 mb-1">
                Enter 12-digit UTR / Reference No. <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={16}
                placeholder="e.g. 420918273645"
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                className="w-full bg-[#FDF8F4] border border-rose-200 rounded-xl px-4 py-3 text-dark-800 font-mono text-sm placeholder-gray-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold py-3.5 rounded-xl shadow-glow-rose transition-all flex items-center justify-center gap-2 text-sm"
            >
              <CheckCircle2 size={18} />
              Submit Payment Proof & Confirm Order
            </button>
          </form>

          <div className="text-center">
            <p className="text-[11px] text-dark-400">
              Need help? Contact support on WhatsApp <span className="font-bold text-dark-800">{settings.businessWhatsapp}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpiQrModal;
