import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag, Tag, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useCartStore from '../store/useCartStore';
import { formatINR } from '../utils/formatCurrency';
import couponService from '../services/couponService';
import toast from 'react-hot-toast';

export default function Cart() {
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    clearCart,
    getSubtotal,
    getShipping,
    getDiscount,
    getTotal,
    coupon: appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useCartStore();

  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const subtotal = getSubtotal();
  const shipping = getShipping();
  const discount = getDiscount();
  const total = getTotal();

  const handleApplyCoupon = async () => {
    if (!couponCode) return toast.error('Please enter a coupon code');
    setIsValidating(true);
    try {
      const res = await couponService.validateCoupon(couponCode, subtotal);
      if (res && res.success) {
        applyCoupon(res.data);
        toast.success(`Coupon "${couponCode.toUpperCase()}" applied successfully! 🎉`);
        setCouponCode('');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Invalid coupon code');
      removeCoupon();
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F4] text-[#3D2B1F] font-sans flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-6 pt-24 md:pt-28 pb-12">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-10 border-b border-rose-100 pb-6">Your Cart</h1>
        
        {items.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-rose-100">
            <ShoppingBag size={64} className="mx-auto text-dark-300 mb-6" />
            <h2 className="text-2xl font-display font-bold text-dark-800 mb-4">Your cart is empty</h2>
            <p className="text-dark-400 mb-8">Looks like you haven't added any luxury sets yet.</p>
            <Link to="/shop" className="inline-block px-8 py-3 bg-rose-500 hover:bg-rose-600 text-dark-800 rounded-full font-medium transition-all">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Cart Items */}
            <div className="w-full lg:w-2/3 space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-6 p-4 md:p-6 bg-white rounded-2xl border border-rose-100 relative">
                  <div className="w-24 h-32 md:w-32 md:h-40 rounded-xl overflow-hidden shrink-0">
                    <img 
                      src={item.product?.images?.[0]?.url || item.product?.images?.[0] || 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600'} 
                      alt={item.product?.name || 'Product'} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg md:text-xl font-bold font-display text-dark-800">{item.product?.name || 'Handcrafted Nail Set'}</h3>
                        <button onClick={() => removeItem(item.id)} className="text-dark-300 hover:text-rose-500 transition-colors">
                          <Trash2 size={20} />
                        </button>
                      </div>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-rose-500 font-semibold">{formatINR(item.product?.discountPrice || item.product?.price || 0)}</span>
                        {item.product?.discountPrice && item.product.discountPrice < item.product.price && (
                          <span className="text-xs text-dark-300 line-through">{formatINR(item.product.price)}</span>
                        )}
                      </div>
                      <div className="text-sm text-dark-400 mt-2 space-y-1">
                        <p>Shape: {item.shape} | Length: {item.length}</p>
                        <p>Size: {item.size}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center justify-between border border-rose-200 rounded-lg px-3 py-1 w-28 bg-[#FDF8F4]">
                        <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="text-dark-400 hover:text-dark-800 p-1"><Minus size={14} /></button>
                        <span className="font-semibold text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-dark-400 hover:text-dark-800 p-1"><Plus size={14} /></button>
                      </div>
                      <div className="text-right flex-1 font-semibold text-dark-800">
                        {formatINR((item.product?.discountPrice || item.product?.price || 0) * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white border border-rose-100 rounded-2xl p-6 lg:p-8 sticky top-24">
                <h3 className="text-xl font-display font-bold text-dark-800 mb-6">Order Summary</h3>
                
                <div className="space-y-4 text-sm text-dark-400 mb-6 border-b border-rose-100 pb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-dark-800 font-medium">{formatINR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-dark-800 font-medium">{shipping === 0 ? 'Free' : formatINR(shipping)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount</span>
                      <span>-{formatINR(discount)}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-end mb-8">
                  <span className="text-lg font-bold text-dark-800">Total</span>
                  <span className="text-2xl font-bold text-rose-500">{formatINR(total)}</span>
                </div>

                {appliedCoupon ? (
                  <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-400 text-sm">
                      <Tag size={16} />
                      <span className="font-semibold font-mono">{appliedCoupon.code}</span>
                      <span className="text-xs">({appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}%` : `₹${appliedCoupon.discountValue}`} Off)</span>
                    </div>
                    <button onClick={removeCoupon} className="text-dark-400 hover:text-rose-500 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="mb-6 flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Coupon code" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-[#FDF8F4] border border-rose-200 rounded-lg px-4 py-2 text-sm focus:border-rose-500 focus:outline-none"
                    />
                    <button 
                      onClick={handleApplyCoupon} 
                      disabled={isValidating}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </div>
                )}

                <button onClick={() => navigate('/checkout')} className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-dark-800 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg">
                  Proceed to Checkout <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
