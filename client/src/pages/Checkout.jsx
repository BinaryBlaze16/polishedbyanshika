import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CreditCard, Banknote, ShieldCheck, Loader2, Plus, MapPin, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UpiQrModal from '../components/UpiQrModal';
import AddressCard from '../components/AddressCard';
import AddressModal from '../components/AddressModal';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import orderService from '../services/orderService';
import addressService from '../services/addressService';
import { formatINR } from '../utils/formatCurrency';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { 
    items, 
    clearCart,
    getSubtotal,
    getShipping,
    getDiscount,
    getTotal
  } = useCartStore();

  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  
  // Address States
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isUsingNewForm, setIsUsingNewForm] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm();
  const [shippingData, setShippingData] = useState(null);

  // Load user saved addresses
  useEffect(() => {
    if (user) {
      fetchAddresses();
    } else {
      setLoadingAddresses(false);
      setIsUsingNewForm(true);
    }
  }, [user]);

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const res = await addressService.getAddresses();
      const addrs = res.data || [];
      setAddresses(addrs);
      if (addrs.length > 0) {
        const defaultAddr = addrs.find(a => a.isDefault) || addrs[0];
        handleSelectAddress(defaultAddr);
        setIsUsingNewForm(false);
      } else {
        setIsUsingNewForm(true);
        prefillUserData();
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
      setIsUsingNewForm(true);
      prefillUserData();
    } finally {
      setLoadingAddresses(false);
    }
  };

  const prefillUserData = () => {
    if (user) {
      const names = user.name?.split(' ') || [];
      setValue('firstName', names[0] || '');
      setValue('lastName', names.slice(1).join(' ') || '');
      setValue('email', user.email || '');
      setValue('phone', user.phone || '');
    }
  };

  const handleSelectAddress = (addr) => {
    setSelectedAddress(addr);
    setIsUsingNewForm(false);
    const names = addr.fullName?.split(' ') || user?.name?.split(' ') || [];
    setShippingData({
      firstName: names[0] || '',
      lastName: names.slice(1).join(' ') || '',
      fullName: addr.fullName,
      email: user?.email || '',
      phone: addr.phone,
      houseNumber: addr.houseNumber,
      street: addr.street,
      landmark: addr.landmark || '',
      address: `${addr.houseNumber}, ${addr.street}`,
      address2: addr.landmark || '',
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      country: addr.country || 'India',
      addressType: addr.addressType || 'Home'
    });
  };

  const handleSaveModalAddress = async (data) => {
    try {
      let res;
      if (editingAddress) {
        res = await addressService.updateAddress(editingAddress._id || editingAddress.id, data);
        toast.success('Address updated successfully!');
      } else {
        res = await addressService.createAddress(data);
        toast.success('New address added & saved to your profile! 🏠');
      }
      
      const newAddr = res.data;
      await fetchAddresses();
      if (newAddr) {
        handleSelectAddress(newAddr);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to save address');
      throw err;
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await addressService.deleteAddress(id);
      toast.success('Address deleted');
      if (selectedAddress?._id === id || selectedAddress?.id === id) {
        setSelectedAddress(null);
      }
      fetchAddresses();
    } catch (err) {
      toast.error('Failed to delete address');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await addressService.setDefaultAddress(id);
      toast.success('Set as default address');
      fetchAddresses();
    } catch (err) {
      toast.error('Failed to update default address');
    }
  };

  const subtotal = getSubtotal();
  const shipping = getShipping();
  const discount = getDiscount();
  const total = getTotal();

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const onNewAddressSubmit = async (data) => {
    const formattedData = {
      firstName: data.firstName,
      lastName: data.lastName,
      fullName: `${data.firstName} ${data.lastName}`.trim(),
      email: data.email,
      phone: data.phone,
      houseNumber: data.address,
      street: data.address2 || data.address,
      landmark: data.landmark || '',
      address: data.address,
      address2: data.address2 || '',
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      country: 'India',
      saveToProfile: data.saveToProfile
    };

    setShippingData(formattedData);

    // If user asked to save to profile
    if (data.saveToProfile && user) {
      try {
        await addressService.createAddress({
          fullName: formattedData.fullName,
          phone: formattedData.phone,
          addressType: 'Home',
          houseNumber: data.address,
          street: data.address2 || data.address,
          landmark: data.landmark || '',
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          country: 'India',
          isDefault: addresses.length === 0
        });
        toast.success('Address saved to your profile!');
        fetchAddresses();
      } catch (err) {
        console.error('Failed to auto save address:', err);
      }
    }

    setStep(2);
  };

  const handleProceedWithSelectedAddress = () => {
    if (!selectedAddress) {
      return toast.error('Please select or add a shipping address');
    }
    handleSelectAddress(selectedAddress);
    setStep(2);
  };

  const buildOrderPayload = (extraData = {}) => {
    const shippingAddress = {
      fullName: shippingData.fullName || `${shippingData.firstName || ''} ${shippingData.lastName || ''}`.trim(),
      phone: shippingData.phone,
      houseNumber: shippingData.houseNumber || shippingData.address,
      street: shippingData.street || shippingData.address2 || shippingData.address,
      landmark: shippingData.landmark || '',
      addressLine1: shippingData.address || `${shippingData.houseNumber}, ${shippingData.street}`,
      addressLine2: shippingData.address2 || shippingData.landmark || '',
      city: shippingData.city,
      state: shippingData.state,
      pincode: shippingData.pincode,
      country: shippingData.country || 'India',
      addressType: shippingData.addressType || 'Home'
    };

    const orderItems = items.map(item => ({
      product: item.product?._id || item.product?.id || item._id || item.id,
      quantity: item.quantity || item.qty || 1,
      shape: item.shape || item.selectedShape,
      length: item.length || item.selectedLength,
      size: item.size || item.selectedSize,
      customSizes: item.customSizes || item.customSizeInMm
    }));

    const { coupon } = useCartStore.getState();

    return {
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod === 'cod' ? 'COD' : 'UPI_MANUAL',
      couponCode: coupon?.code || null,
      saveToProfile: shippingData.saveToProfile || false,
      ...extraData
    };
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'upi') {
      // For online payment: open UPI QR & UTR Modal FIRST without creating order in DB yet
      setIsUpiModalOpen(true);
      return;
    }

    // Cash on Delivery (COD): Place order directly in 1 click
    setIsPlacingOrder(true);
    const toastId = toast.loading('Placing your COD order...');
    try {
      const orderPayload = buildOrderPayload();
      const res = await orderService.createOrder(orderPayload);
      if (res && res.success) {
        toast.success('COD Order placed successfully! 💅', { id: toastId });
        const orderObj = res.data;
        clearCart();
        navigate(`/order/${orderObj._id || orderObj.id}`);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to place order. Please try again.', { id: toastId });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handlePaymentSubmit = async (utr) => {
    // Called when customer submits 12-digit UTR from UpiQrModal
    const toastId = toast.loading('Creating order & submitting payment proof...');
    try {
      const orderPayload = buildOrderPayload({ utrNumber: utr });
      const res = await orderService.createOrder(orderPayload);
      if (res && res.success) {
        toast.success('Payment proof submitted & Order placed successfully! 💅', { id: toastId });
        const orderObj = res.data;
        setIsUpiModalOpen(false);
        clearCart();
        navigate(`/order/${orderObj._id || orderObj.id}`);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to submit payment & create order', { id: toastId });
    }
  };

  const Input = ({ label, name, type="text", ...rest }) => (
    <div className="flex flex-col gap-1 mb-4">
      <label className="text-xs font-semibold text-dark-600">{label} *</label>
      <input 
        type={type} 
        {...register(name, { required: `${label} is required` })} 
        className="w-full bg-[#FDF8F4] border border-rose-200 rounded-xl px-4 py-3 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500/50 transition-all text-dark-800 text-sm"
        {...rest}
      />
      {errors[name] && <span className="text-xs text-rose-500">{errors[name].message}</span>}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDF8F4] text-[#3D2B1F] font-sans flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-6 max-w-6xl pt-24 md:pt-28 pb-12">
        <h1 className="text-3xl font-display font-bold mb-8 text-dark-800">Checkout</h1>
        
        {/* Stepper */}
        <div className="flex items-center mb-12">
          {['Shipping', 'Payment', 'Review'].map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step >= i+1 ? 'bg-rose-500 text-white shadow-glow-rose' : 'bg-rose-50 text-dark-400 border border-rose-200'
                }`}>
                  {step > i+1 ? <Check size={16} /> : i+1}
                </div>
                <span className={`text-sm font-medium ${step >= i+1 ? 'text-dark-800' : 'text-dark-400'}`}>{s}</span>
              </div>
              {i < 2 && <div className={`flex-1 h-px mx-4 transition-all ${step > i+1 ? 'bg-rose-500' : 'bg-rose-200'}`}></div>}
            </React.Fragment>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Content */}
          <div className="flex-1">
            {step === 1 && (
              <div className="bg-white border border-rose-100 rounded-3xl p-6 lg:p-8 shadow-card">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-rose-100">
                  <div>
                    <h2 className="text-xl font-bold text-dark-800 font-display flex items-center gap-2">
                      <MapPin size={22} className="text-rose-500" /> Delivery Address
                    </h2>
                    <p className="text-xs text-dark-400 mt-0.5">Select where you want your order delivered</p>
                  </div>

                  {user && addresses.length > 0 && !isUsingNewForm && (
                    <button
                      onClick={() => {
                        setEditingAddress(null);
                        setIsAddressModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-semibold border border-rose-200 transition-colors shadow-xs"
                    >
                      <Plus size={16} /> Add New Address
                    </button>
                  )}
                </div>

                {/* Loading State */}
                {loadingAddresses ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                    <Loader2 className="animate-spin text-rose-500" size={32} />
                    <p className="text-sm text-dark-400">Loading your saved addresses...</p>
                  </div>
                ) : user && addresses.length > 0 && !isUsingNewForm ? (
                  /* Saved Addresses Cards Grid */
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((addr) => (
                        <AddressCard
                          key={addr._id || addr.id}
                          address={addr}
                          isSelected={(selectedAddress?._id || selectedAddress?.id) === (addr._id || addr.id)}
                          onSelect={handleSelectAddress}
                          onEdit={(a) => {
                            setEditingAddress(a);
                            setIsAddressModalOpen(true);
                          }}
                          onDelete={handleDeleteAddress}
                          onSetDefault={handleSetDefault}
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-rose-100">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUsingNewForm(true);
                          setSelectedAddress(null);
                          prefillUserData();
                        }}
                        className="text-xs font-semibold text-rose-500 hover:text-rose-600 hover:underline flex items-center gap-1"
                      >
                        + Enter a new address instead
                      </button>

                      <button
                        type="button"
                        onClick={handleProceedWithSelectedAddress}
                        className="px-8 py-3.5 bg-gradient-to-r from-rose-500 to-rose-400 hover:from-rose-600 hover:to-rose-500 text-white rounded-xl font-semibold text-sm transition-all shadow-glow-rose flex items-center gap-2"
                      >
                        Deliver to this Address <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Manual Entry Form for New Users or when clicked "Enter new address" */
                  <div>
                    {user && addresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsUsingNewForm(false);
                          if (addresses.length > 0) setSelectedAddress(addresses[0]);
                        }}
                        className="text-xs font-semibold text-rose-500 hover:underline mb-6 block"
                      >
                        ← Back to saved addresses
                      </button>
                    )}

                    <form onSubmit={handleSubmit(onNewAddressSubmit)}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <Input label="First Name" name="firstName" />
                        <Input label="Last Name" name="lastName" />
                        <Input label="Email" name="email" type="email" />
                        <Input label="Phone" name="phone" type="tel" />
                        
                        <div className="md:col-span-2">
                          <Input label="House / Flat No. / Building Name" name="address" placeholder="e.g. Flat 402, Royal Apartments" />
                        </div>
                        <div className="md:col-span-2">
                          <div className="flex flex-col gap-1 mb-4">
                            <label className="text-xs font-semibold text-dark-600">Street / Area / Locality *</label>
                            <input 
                              type="text" 
                              placeholder="e.g. MG Road, Sector 15"
                              {...register("address2", { required: 'Street / Area is required' })} 
                              className="w-full bg-[#FDF8F4] border border-rose-200 rounded-xl px-4 py-3 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500/50 transition-all text-dark-800 text-sm"
                            />
                            {errors.address2 && <span className="text-xs text-rose-500">{errors.address2.message}</span>}
                          </div>
                        </div>

                        <Input label="City" name="city" placeholder="e.g. Lucknow" />
                        <Input label="State" name="state" placeholder="e.g. Uttar Pradesh" />
                        <Input label="PIN Code" name="pincode" placeholder="6-digit PIN code" />
                      </div>

                      {user && (
                        <div className="flex items-center gap-2 mb-6 mt-2">
                          <input 
                            type="checkbox" 
                            id="saveToProfile"
                            defaultChecked={true}
                            {...register('saveToProfile')}
                            className="w-4 h-4 rounded text-rose-500 border-rose-300 focus:ring-rose-500 cursor-pointer"
                          />
                          <label htmlFor="saveToProfile" className="text-xs text-dark-700 font-medium cursor-pointer">
                            Save this address to my profile for future orders 🏠
                          </label>
                        </div>
                      )}

                      <button 
                        type="submit" 
                        className="px-8 py-3.5 bg-gradient-to-r from-rose-500 to-rose-400 hover:from-rose-600 hover:to-rose-500 text-white rounded-xl font-semibold transition-all shadow-glow-rose w-full md:w-auto flex items-center justify-center gap-2"
                      >
                        Continue to Payment <ArrowRight size={16} />
                      </button>
                    </form>
                  </div>
                )}

              </div>
            )}

            {step === 2 && (
              <div className="bg-white border border-rose-100 rounded-3xl p-6 lg:p-8 shadow-card">
                <h2 className="text-xl font-bold mb-6 text-dark-800 font-display">Select Payment Method</h2>
                <div className="space-y-4">
                  <label className={`flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-2 border-rose-500 bg-rose-50/50' : 'border-rose-100 bg-[#FDF8F4] hover:border-rose-200'}`}>
                    <input type="radio" name="payment" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="w-4 h-4 accent-rose-500" />
                    <CreditCard className={paymentMethod === 'upi' ? 'text-rose-500' : 'text-dark-400'} size={24} />
                    <div>
                      <div className="font-semibold text-dark-800">UPI (GPay, PhonePe, Paytm, BHIM)</div>
                      <div className="text-xs text-dark-400 mt-0.5">Instant payment via QR Code or UPI ID</div>
                    </div>
                  </label>

                  <label className={`flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-2 border-rose-500 bg-rose-50/50' : 'border-rose-100 bg-[#FDF8F4] hover:border-rose-200'}`}>
                    <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-4 h-4 accent-rose-500" />
                    <Banknote className={paymentMethod === 'cod' ? 'text-rose-500' : 'text-dark-400'} size={24} />
                    <div>
                      <div className="font-semibold text-dark-800">Cash on Delivery (COD)</div>
                      <div className="text-xs text-dark-400 mt-0.5">Pay in cash when your order arrives</div>
                    </div>
                  </label>
                </div>
                
                <div className="mt-8 flex gap-4">
                  <button onClick={() => setStep(1)} className="px-6 py-3 border border-rose-200 hover:bg-rose-50 text-dark-700 rounded-xl font-medium text-sm transition-all">
                    Back to Address
                  </button>
                  <button onClick={() => setStep(3)} className="px-8 py-3 bg-gradient-to-r from-rose-500 to-rose-400 hover:from-rose-600 hover:to-rose-500 text-white rounded-xl font-semibold text-sm transition-all shadow-glow-rose flex items-center gap-2">
                    Review Order <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-white border border-rose-100 rounded-3xl p-6 lg:p-8 shadow-card">
                  <div className="flex justify-between items-center mb-4 pb-3 border-b border-rose-100">
                    <h2 className="text-xl font-bold text-dark-800 font-display">Delivery Address</h2>
                    <button onClick={() => setStep(1)} className="text-rose-500 text-xs font-semibold hover:underline">Change</button>
                  </div>
                  <div className="text-dark-700 text-sm leading-relaxed">
                    <p className="font-semibold text-base text-dark-800 mb-1">
                      {shippingData?.fullName || `${shippingData?.firstName || ''} ${shippingData?.lastName || ''}`}
                    </p>
                    <p>{shippingData?.houseNumber}, {shippingData?.street}</p>
                    {shippingData?.landmark && <p className="text-xs text-dark-400">Landmark: {shippingData.landmark}</p>}
                    <p>{shippingData?.city}, {shippingData?.state} - <span className="font-semibold">{shippingData?.pincode}</span></p>
                    <p className="mt-2 text-xs text-dark-400 font-medium">📞 {shippingData?.phone} • ✉️ {shippingData?.email}</p>
                  </div>
                </div>

                <div className="bg-white border border-rose-100 rounded-3xl p-6 lg:p-8 shadow-card">
                  <div className="flex justify-between items-center mb-4 pb-3 border-b border-rose-100">
                    <h2 className="text-xl font-bold text-dark-800 font-display">Payment Method</h2>
                    <button onClick={() => setStep(2)} className="text-rose-500 text-xs font-semibold hover:underline">Change</button>
                  </div>
                  <p className="text-dark-800 font-semibold text-sm">
                    {paymentMethod === 'upi' ? '💳 UPI (GPay, PhonePe, Paytm)' : '💵 Cash on Delivery (COD)'}
                  </p>
                </div>
                
                <button 
                  onClick={handlePlaceOrder} 
                  disabled={isPlacingOrder}
                  className="w-full py-4 bg-gradient-to-r from-rose-500 to-rose-400 hover:from-rose-600 hover:to-rose-500 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-glow-rose disabled:opacity-50"
                >
                  {isPlacingOrder ? <Loader2 className="animate-spin" size={24} /> : <ShieldCheck size={24} />} 
                  {paymentMethod === 'upi' ? 'Pay & Place Order' : 'Place Order (COD)'}
                </button>
              </div>
            )}
          </div>

          {/* Cart Sidebar */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white border border-rose-100 rounded-3xl p-6 sticky top-28 shadow-card">
              <h3 className="font-display font-bold text-lg mb-4 pb-4 border-b border-rose-100 text-dark-800">Order Summary</h3>
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-linen-100 border border-rose-100 shrink-0">
                      <img 
                        src={item.product?.images?.[0]?.url || item.product?.images?.[0] || 'https://via.placeholder.com/150'} 
                        alt={item.product?.name || 'Product'} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-1 text-sm">
                      <div className="text-dark-800 font-medium line-clamp-1">{item.product?.name || 'Handcrafted Nail Set'}</div>
                      <div className="text-dark-400 text-xs mt-1">Qty: {item.quantity} | {item.shape} | {item.size}</div>
                      <div className="text-rose-500 font-semibold mt-1">{formatINR(item.product?.discountPrice || item.product?.price || 0)}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-3 text-sm text-dark-400 border-t border-rose-100 pt-4">
                <div className="flex justify-between"><span>Subtotal</span><span className="text-dark-800 font-medium">{formatINR(subtotal)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span className="text-dark-800 font-medium">{shipping === 0 ? 'Free' : formatINR(shipping)}</span></div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-{formatINR(discount)}</span></div>
                )}
                <div className="flex justify-between items-center pt-3 border-t border-rose-100">
                  <span className="font-bold text-dark-800 text-base">Total</span>
                  <span className="font-bold text-rose-500 text-xl">{formatINR(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />

      {/* Address Add / Edit Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSave={handleSaveModalAddress}
        initialData={editingAddress}
      />

      <UpiQrModal 
        isOpen={isUpiModalOpen} 
        total={total} 
        orderId={createdOrder?._id || createdOrder?.id}
        onClose={() => {
          setIsUpiModalOpen(false);
          clearCart();
          if (createdOrder) {
            navigate(`/order/${createdOrder._id || createdOrder.id}`);
          }
        }} 
        onPaymentSubmit={handlePaymentSubmit} 
      />
    </div>
  );
}
