import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2, Clock, Package, Truck, Home, ArrowLeft, Loader2,
  ShoppingBag, Star, PartyPopper, ShieldCheck, XCircle, RefreshCw,
  ChevronRight, Box, MapPin
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import orderService from '../services/orderService';
import reviewService from '../services/reviewService';
import { formatINR, formatDate } from '../utils/formatCurrency';
import toast from 'react-hot-toast';

const WriteReviewModal = lazy(() => import('../components/WriteReviewModal'));

// ─── All supported order statuses in sequence ─────────────────────────────────
const STATUS_STEPS = [
  { key: 'Pending',          label: 'Order Placed',      icon: Clock,         desc: 'We have received your order' },
  { key: 'Accepted',         label: 'Accepted',          icon: ShieldCheck,   desc: 'Order verified & accepted' },
  { key: 'Preparing',        label: 'Preparing',         icon: Box,           desc: 'Handcrafting your nails' },
  { key: 'Packed',           label: 'Packed',            icon: Package,       desc: 'Order packed & ready to ship' },
  { key: 'Shipped',          label: 'Shipped',           icon: Truck,         desc: 'On its way to you!' },
  { key: 'Out For Delivery', label: 'Out for Delivery',  icon: MapPin,        desc: 'Arriving at your doorstep' },
  { key: 'Delivered',        label: 'Delivered',         icon: CheckCircle2,  desc: 'Enjoy your beautiful nails! 💅' },
];

// Map each status to its index in the flow
const STATUS_INDEX = Object.fromEntries(STATUS_STEPS.map((s, i) => [s.key, i]));

function StarRating({ rating }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(n => (
        <Star key={n} size={12}
          className={n <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
        />
      ))}
    </span>
  );
}

export default function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState(null); // { item, existingReview }
  const [itemReviewMap, setItemReviewMap] = useState({}); // orderItemId → review

  useEffect(() => {
    orderService.getOrderById(id)
      .then(res => {
        if (res && res.success) {
          setOrder(res.data);
          // If delivered, check reviews for each item
          if (res.data.orderStatus === 'Delivered') {
            fetchItemReviews(res.data);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const fetchItemReviews = async (ord) => {
    const map = {};
    await Promise.all(
      (ord.orderItems || []).map(async (item) => {
        try {
          const res = await reviewService.checkReviewEligibility(ord._id, item._id);
          map[item._id] = res.review || null;
        } catch (_) {}
      })
    );
    setItemReviewMap(map);
  };

  const handleReviewSubmitted = () => {
    setReviewModal(null);
    toast.success('Review submitted! It will be visible after admin approval. ✨');
    fetchItemReviews(order);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF8F4] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-rose-500" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FDF8F4] flex items-center justify-center flex-col gap-4">
        <Package size={48} className="text-rose-300" />
        <p className="text-dark-600 font-semibold">Order not found</p>
        <Link to="/profile" className="text-rose-500 underline">Back to My Orders</Link>
      </div>
    );
  }

  const isCancelled = order.orderStatus === 'Cancelled';
  const isDelivered = order.orderStatus === 'Delivered';
  const currentIndex = isCancelled ? -1 : (STATUS_INDEX[order.orderStatus] ?? 0);

  // Build timeline timestamp map from statusHistory
  const historyMap = {};
  (order.statusHistory || []).forEach(h => {
    historyMap[h.status] = h.updatedAt;
  });

  return (
    <div className="min-h-screen bg-[#FDF8F4] text-[#3D2B1F] font-sans flex flex-col">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 sm:px-6 pt-24 md:pt-28 pb-16 max-w-4xl">
        <Link to="/profile" className="inline-flex items-center gap-2 text-dark-400 hover:text-rose-500 mb-6 transition-colors text-sm font-medium">
          <ArrowLeft size={16} /> Back to My Orders
        </Link>

        {/* ─── Header ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-dark-800">Order Tracking</h1>
            <p className="text-dark-400 text-sm mt-1">
              Order #{order.orderNumber} &nbsp;·&nbsp; Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          {order.trackingNumber && (
            <div className="bg-white border border-rose-100 px-4 py-2.5 rounded-xl text-sm shadow-sm">
              <span className="text-dark-400 text-xs block">Tracking Number</span>
              <span className="text-dark-800 font-semibold">{order.trackingNumber}</span>
              {order.courierPartner && <span className="text-dark-400 text-xs ml-2">({order.courierPartner})</span>}
            </div>
          )}
        </div>

        {/* ─── Delivered Celebration Banner ────────────────────────────────── */}
        {isDelivered && (
          <div className="relative overflow-hidden bg-gradient-to-br from-rose-500 via-rose-400 to-amber-400 rounded-3xl p-8 mb-8 text-white shadow-2xl">
            <div className="absolute -top-8 -right-8 w-48 h-48 bg-white/10 rounded-full" />
            <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-white/10 rounded-full" />
            <div className="relative text-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-3xl flex items-center justify-center mx-auto mb-4 border border-white/30">
                <PartyPopper size={40} className="text-white" />
              </div>
              <h2 className="text-3xl font-display font-bold">Order Delivered! 🎉</h2>
              <p className="text-white/80 mt-2 text-sm">Thank you for shopping with us. We hope you love your handmade nails!</p>
              {order.deliveredAt && (
                <p className="text-white/70 text-xs mt-2 font-medium">
                  Delivered on {formatDate(order.deliveredAt)}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                <Link to="/shop"
                  className="px-6 py-3 bg-white text-rose-600 font-bold rounded-2xl text-sm hover:bg-rose-50 transition-all shadow-sm">
                  Continue Shopping
                </Link>
                <Link to="/shop"
                  className="px-6 py-3 bg-white/20 text-white border border-white/30 font-bold rounded-2xl text-sm hover:bg-white/30 transition-all">
                  Buy Again
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ─── Cancelled Banner ────────────────────────────────────────────── */}
        {isCancelled && (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-6 mb-8 flex items-center gap-4">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center border border-red-200">
              <XCircle size={28} className="text-red-500" />
            </div>
            <div>
              <h2 className="font-bold text-red-800 text-lg">Order Cancelled</h2>
              <p className="text-red-600/80 text-sm mt-0.5">
                {historyMap['Cancelled']
                  ? `Cancelled on ${formatDate(historyMap['Cancelled'])}`
                  : 'This order has been cancelled.'}
              </p>
            </div>
            <Link to="/shop" className="ml-auto px-4 py-2 bg-rose-500 text-white rounded-xl text-sm font-semibold hover:bg-rose-600 transition-all">
              Shop Again
            </Link>
          </div>
        )}

        {/* ─── Dynamic Timeline ────────────────────────────────────────────── */}
        {!isCancelled && (
          <div className="bg-white border border-rose-100 rounded-3xl p-6 md:p-8 mb-8 shadow-sm">
            <h2 className="font-display font-bold text-dark-800 text-lg mb-8">Order Timeline</h2>
            <div className="relative">
              {/* Vertical connector line */}
              <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-rose-100 z-0" />

              <div className="space-y-0">
                {STATUS_STEPS.map((step, i) => {
                  const isCompleted = i < currentIndex;
                  const isActive = i === currentIndex;
                  const isFuture = i > currentIndex;
                  const Icon = step.icon;
                  const timestamp = historyMap[step.key];

                  return (
                    <div key={step.key} className="relative flex gap-4 md:gap-6 pb-7 last:pb-0">
                      {/* Icon */}
                      <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 transition-all duration-500 ${
                        isCompleted ? 'bg-rose-500 border-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.4)]' :
                        isActive    ? 'bg-white border-rose-500 text-rose-500 shadow-[0_0_0_4px_rgba(244,63,94,0.15)] animate-pulse' :
                                      'bg-white border-rose-100 text-rose-200'
                      }`}>
                        {isCompleted ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pt-1.5 pb-1">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                          <span className={`font-semibold text-sm ${isFuture ? 'text-dark-300' : 'text-dark-800'}`}>
                            {step.label}
                          </span>
                          {isActive && (
                            <span className="text-xs font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                              Current Status
                            </span>
                          )}
                          {isCompleted && timestamp && (
                            <span className="text-xs text-dark-400">{formatDate(timestamp)}</span>
                          )}
                        </div>
                        <p className={`text-xs mt-0.5 ${isFuture ? 'text-dark-200' : 'text-dark-400'}`}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ─── Order Items ─────────────────────────────────────────────────── */}
        <div className="bg-white border border-rose-100 rounded-3xl p-6 mb-6 shadow-sm">
          <h3 className="font-display font-bold text-dark-800 text-lg mb-5">
            {isDelivered ? 'Your Items — Rate & Review' : 'Order Items'}
          </h3>
          <div className="space-y-4">
            {order.orderItems?.map(item => {
              const existingReview = itemReviewMap[item._id];
              return (
                <div key={item._id} className="flex gap-4 items-start p-4 rounded-2xl bg-[#FDF8F4] border border-rose-50">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-rose-100">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-dark-800 text-sm leading-snug">{item.name}</p>
                    <p className="text-xs text-dark-400 mt-0.5">
                      Qty: {item.qty}
                      {item.selectedShape && ` · ${item.selectedShape}`}
                      {item.selectedLength && ` · ${item.selectedLength}`}
                    </p>
                    <p className="text-rose-500 font-semibold text-sm mt-1">{formatINR(item.price * item.qty)}</p>

                    {/* Review status / button for delivered orders */}
                    {isDelivered && (
                      <div className="mt-2">
                        {existingReview ? (
                          <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-1.5">
                              <StarRating rating={existingReview.rating} />
                              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${
                                existingReview.status === 'Approved'  ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                existingReview.status === 'Rejected'  ? 'bg-red-50 text-red-600 border-red-200' :
                                'bg-amber-50 text-amber-600 border-amber-200'
                              }`}>
                                {existingReview.status === 'Approved' ? '✓ Approved' :
                                 existingReview.status === 'Rejected' ? '✗ Rejected' : '⏳ Under Review'}
                              </span>
                            </div>
                            <button
                              onClick={() => setReviewModal({ item, order, existingReview })}
                              className="text-xs text-rose-500 underline hover:text-rose-700 font-medium"
                            >
                              Edit Review
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setReviewModal({ item, order, existingReview: null })}
                            className="mt-1 flex items-center gap-1.5 px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
                          >
                            <Star size={13} /> Write a Review
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-rose-100 mt-5 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-dark-500">
              <span>Items Subtotal</span>
              <span>{formatINR(order.itemsPrice)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span>-{formatINR(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-dark-500">
              <span>Shipping</span>
              <span>{order.shippingPrice > 0 ? formatINR(order.shippingPrice) : 'FREE'}</span>
            </div>
            <div className="flex justify-between font-bold text-dark-800 text-base pt-1 border-t border-rose-50">
              <span>Total</span>
              <span className="text-rose-500">{formatINR(order.totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* ─── Shipping Info ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-sm">
            <h3 className="font-display font-bold text-dark-800 mb-4">Shipping Address</h3>
            <div className="text-sm text-dark-500 leading-relaxed">
              <p className="font-semibold text-dark-800 mb-1">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.addressLine1}</p>
              {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.pincode}</p>
              <p className="mt-2 text-dark-400">📞 {order.shippingAddress?.phone}</p>
            </div>
          </div>

          <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-sm">
            <h3 className="font-display font-bold text-dark-800 mb-4">Payment Details</h3>
            <div className="text-sm text-dark-500 space-y-2">
              <div className="flex justify-between">
                <span>Method</span>
                <span className="font-medium text-dark-800">{order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'UPI Payment'}</span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span className={`font-semibold ${order.paymentDetails?.isPaid ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {order.paymentDetails?.isPaid ? '✓ Paid' : order.paymentMethod === 'COD' ? 'Pay on Delivery' : 'Pending Verification'}
                </span>
              </div>
              {order.paymentDetails?.utrNumber && (
                <div className="flex justify-between">
                  <span>UTR</span>
                  <span className="font-mono text-xs text-dark-800">{order.paymentDetails.utrNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* ─── Write Review Modal ───────────────────────────────────────────── */}
      {reviewModal && (
        <Suspense fallback={null}>
          <WriteReviewModal
            order={reviewModal.order}
            item={reviewModal.item}
            existingReview={reviewModal.existingReview}
            onClose={() => setReviewModal(null)}
            onSuccess={handleReviewSubmitted}
          />
        </Suspense>
      )}
    </div>
  );
}
