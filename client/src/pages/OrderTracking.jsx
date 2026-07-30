import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Clock, Package, Truck, Home, ArrowLeft, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import orderService from '../services/orderService';
import { formatINR, formatDate, getStatusColor } from '../utils/formatCurrency';

export default function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getOrderById(id)
      .then(res => {
        if (res && res.success) {
          setOrder(res.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF8F4] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-rose-500" />
      </div>
    );
  }

  if (!order) return <div className="min-h-screen bg-[#FDF8F4] text-dark-800 flex items-center justify-center">Order not found</div>;

  const steps = [
    { key: 'placed', icon: Clock, label: 'Order Placed', desc: 'We have received your order' },
    { key: 'handcrafting', icon: Package, label: 'Crafting', desc: 'Your nails are being handcrafted' },
    { key: 'shipped', icon: Truck, label: 'Shipped', desc: 'Order is on the way' },
    { key: 'delivered', icon: Home, label: 'Delivered', desc: 'Enjoy your beautiful nails!' }
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'Pending':
      case 'Accepted':
        return 0;
      case 'Preparing':
      case 'Packed':
        return 1;
      case 'Shipped':
      case 'Out For Delivery':
        return 2;
      case 'Delivered':
        return 3;
      default:
        return 0;
    }
  };

  const currentStepIndex = getStepIndex(order.orderStatus);

  return (
    <div className="min-h-screen bg-[#FDF8F4] text-[#3D2B1F] font-sans flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-6 pt-24 md:pt-28 pb-12 max-w-4xl">
        <Link to="/profile" className="inline-flex items-center gap-2 text-dark-400 hover:text-dark-800 mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Orders
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-dark-800 mb-2">Order Tracking</h1>
            <p className="text-dark-400">Order #{order.orderNumber} • {formatDate(order.createdAt)}</p>
          </div>
          {order.trackingNumber && (
            <div className="bg-white border border-rose-100 px-4 py-2 rounded-lg text-sm">
              <span className="text-dark-400">Tracking Number: </span>
              <span className="text-dark-800 font-medium">{order.trackingNumber} ({order.courierPartner || 'Courier'})</span>
            </div>
          )}
        </div>

        {/* Stepper */}
        <div className="bg-white border border-rose-50 rounded-2xl p-8 pb-20 mb-12 shadow-xl">
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute left-[28px] md:left-0 md:top-[28px] md:right-0 md:h-1 w-0.5 h-full md:w-full bg-rose-50 z-0"></div>
            
            <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-0 relative z-10">
              {steps.map((step, i) => {
                const isCompleted = i <= currentStepIndex;
                
                return (
                  <div key={step.key} className="flex md:flex-col items-center md:items-start md:w-1/4 gap-4 md:gap-4 relative">
                    {/* Line fill for completed */}
                    {i < steps.length - 1 && (
                      <div className={`hidden md:block absolute top-[28px] left-1/2 w-full h-1 ${i < currentStepIndex ? 'bg-rose-500' : 'bg-transparent'} z-[-1]`}></div>
                    )}
                    
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 border-4 border-[#1a1b2e] transition-colors duration-500 ${isCompleted ? 'bg-rose-500 text-dark-800' : 'bg-[#FDF8F4] text-dark-300 border-rose-100'}`}>
                      <step.icon size={24} />
                    </div>
                    
                    <div className="md:text-center md:absolute md:top-[68px] md:left-1/2 md:-translate-x-1/2 md:w-28">
                      <h4 className={`font-semibold ${isCompleted ? 'text-dark-800' : 'text-dark-300'}`}>{step.label}</h4>
                      <p className="text-xs text-dark-400 mt-1 hidden md:block">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-rose-100 rounded-2xl p-6">
            <h3 className="font-display font-bold text-lg mb-4">Items Summary</h3>
            <div className="space-y-4">
              {order.orderItems?.map(item => (
                <div key={item._id} className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-black/20 rounded-lg overflow-hidden shrink-0">
                    <img 
                      src={item.image || 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600'} 
                      alt={item.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-dark-800">{item.name}</div>
                    <div className="text-sm text-dark-400">Qty: {item.qty} | Shape: {item.selectedShape}</div>
                  </div>
                  <div className="font-semibold text-rose-500">{formatINR(item.price)}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-rose-100 mt-6 pt-4 flex justify-between font-bold text-lg">
              <span>Total Amount</span>
              <span className="text-rose-500">{formatINR(order.totalPrice)}</span>
            </div>
          </div>

          <div className="bg-white border border-rose-100 rounded-2xl p-6">
            <h3 className="font-display font-bold text-lg mb-4">Shipping Information</h3>
            <div className="text-dark-400">
              <p className="font-medium text-dark-800 mb-2">{order.shippingAddress?.fullName}</p>
              <p className="leading-relaxed">
                {order.shippingAddress?.addressLine1}
                {order.shippingAddress?.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                <br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
              </p>
              <p className="mt-2 text-sm text-dark-400">Phone: {order.shippingAddress?.phone}</p>
            </div>
            
            <div className="mt-8 p-4 bg-rose-50 border border-rose-500/20 rounded-xl flex gap-3 text-sm text-rose-200">
              <CheckCircle className="text-rose-500 shrink-0" size={20} />
              <p>Handcrafted nails take time! Please allow 2-3 days for processing before they are shipped.</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
