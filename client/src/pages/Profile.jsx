import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { User, Package, MapPin, Heart, LogOut, ChevronRight, Loader2, Plus, Palette, Clock, CheckCircle, XCircle, AlertCircle, IndianRupee, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AddressCard from '../components/AddressCard';
import AddressModal from '../components/AddressModal';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';
import authService from '../services/authService';
import orderService from '../services/orderService';
import addressService from '../services/addressService';
import customRequestService from '../services/customRequestService';
import { formatDate, formatINR, getStatusColor } from '../utils/formatCurrency';
import toast from 'react-hot-toast';

const getCustomRequestStatusColor = (status) => {
  switch (status) {
    case 'Pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'Reviewing': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Quoted': return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'Accepted': return 'bg-green-50 text-green-700 border-green-200';
    case 'Rejected': return 'bg-red-50 text-red-700 border-red-200';
    case 'Completed': return 'bg-rose-50 text-rose-700 border-rose-200';
    default: return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

const getCustomRequestStatusIcon = (status) => {
  switch (status) {
    case 'Pending': return <Clock size={14} />;
    case 'Reviewing': return <AlertCircle size={14} />;
    case 'Quoted': return <IndianRupee size={14} />;
    case 'Accepted': return <CheckCircle size={14} />;
    case 'Rejected': return <XCircle size={14} />;
    case 'Completed': return <CheckCircle size={14} />;
    default: return <Clock size={14} />;
  }
};

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const [activeTab, setActiveTab] = useState(isAdmin ? 'profile' : 'orders');
  
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Custom Requests State
  const [customRequests, setCustomRequests] = useState([]);
  const [loadingCustomRequests, setLoadingCustomRequests] = useState(false);

  // Standalone Address States
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Profile Edit State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Delete Account State
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  useEffect(() => {
    if (activeTab === 'orders' && !isAdmin) {
      fetchMyOrders();
    }
    if (activeTab === 'addresses') {
      fetchMyAddresses();
    }
    if (activeTab === 'custom-requests') {
      fetchMyCustomRequests();
    }
  }, [activeTab]);

  const fetchMyOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await orderService.getMyOrders();
      const orderList = Array.isArray(res) ? res : (res?.data || res?.orders || []);
      setOrders(Array.isArray(orderList) ? orderList : []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load your orders');
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchMyCustomRequests = async () => {
    try {
      setLoadingCustomRequests(true);
      const res = await customRequestService.getMyCustomRequests();
      const reqList = Array.isArray(res) ? res : (res?.data || res?.requests || []);
      setCustomRequests(Array.isArray(reqList) ? reqList : []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load custom requests');
    } finally {
      setLoadingCustomRequests(false);
    }
  };

  const fetchMyAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const res = await addressService.getAddresses();
      const addrList = Array.isArray(res) ? res : (res?.data || res?.addresses || []);
      setAddresses(Array.isArray(addrList) ? addrList : []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load your addresses');
    } finally {
      setLoadingAddresses(false);
    }
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const res = await authService.updateProfile({ name, phone });
      if (res && res.success) {
        updateUser(res.data || res.user);
        toast.success('Profile updated successfully! ✨');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleOpenAddAddress = () => {
    setEditingAddress(null);
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddress = (address) => {
    setEditingAddress(address);
    setIsAddressModalOpen(true);
  };

  const handleSaveModalAddress = async (formData) => {
    try {
      if (editingAddress) {
        await addressService.updateAddress(editingAddress._id, formData);
        toast.success('Address updated! ✨');
      } else {
        await addressService.createAddress(formData);
        toast.success('Address added! 🏠');
      }
      await fetchMyAddresses();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to save address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await addressService.deleteAddress(addressId);
      toast.success('Address deleted');
      await fetchMyAddresses();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete address');
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      await addressService.setDefaultAddress(addressId);
      toast.success('Default address updated! ✨');
      await fetchMyAddresses();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update default address');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmMsg = `⚠️ PERMANENT ACCOUNT DELETION WARNING:\n\nAre you sure you want to permanently delete your account (${user.email})?\n\nThis will PERMANENTLY REMOVE:\n- Your account profile\n- ALL your past orders & order history\n- ALL your saved delivery addresses\n- ALL your custom requests & product reviews\n\nThis action CANNOT be undone! Click OK to proceed.`;

    if (!window.confirm(confirmMsg)) return;

    setIsDeletingAccount(true);
    const toastId = toast.loading('Deleting account and removing data...');
    try {
      const res = await authService.deleteAccount();
      if (res && res.success) {
        toast.success('Your account and data have been permanently deleted.', { id: toastId });
        useCartStore.getState().clearCart();
        logout();
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to delete account. Please try again.', { id: toastId });
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F4] text-[#3D2B1F] font-sans flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-12">
        
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white text-2xl font-bold shadow-glow-rose">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display text-dark-800">{user.name}</h1>
              <p className="text-sm text-dark-400">{user.email}</p>
            </div>
          </div>

          <button 
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Layout Grid */}
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Nav */}
          <div className="w-full md:w-64 shrink-0 space-y-2">
            {!isAdmin && (
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl font-medium text-sm transition-all ${
                  activeTab === 'orders'
                    ? 'bg-rose-500 text-white shadow-glow-rose font-semibold'
                    : 'bg-white border border-rose-100 text-dark-700 hover:bg-rose-50'
                }`}
              >
                <Package size={18} /> My Orders
              </button>
            )}

            {!isAdmin && (
              <button
                onClick={() => setActiveTab('custom-requests')}
                className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl font-medium text-sm transition-all ${
                  activeTab === 'custom-requests'
                    ? 'bg-rose-500 text-white shadow-glow-rose font-semibold'
                    : 'bg-white border border-rose-100 text-dark-700 hover:bg-rose-50'
                }`}
              >
                <Palette size={18} /> Custom Requests
              </button>
            )}

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl font-medium text-sm transition-all ${
                activeTab === 'addresses'
                  ? 'bg-rose-500 text-white shadow-glow-rose font-semibold'
                  : 'bg-white border border-rose-100 text-dark-700 hover:bg-rose-50'
              }`}
            >
              <MapPin size={18} /> My Addresses
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl font-medium text-sm transition-all ${
                activeTab === 'profile'
                  ? 'bg-rose-500 text-white shadow-glow-rose font-semibold'
                  : 'bg-white border border-rose-100 text-dark-700 hover:bg-rose-50'
              }`}
            >
              <User size={18} /> Account Details
            </button>
          </div>

          {/* Main Tab Content */}
          <div className="flex-1">
            
            {/* Account Details Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white border border-rose-100 rounded-3xl p-6 lg:p-8 shadow-card space-y-8">
                <div>
                  <h2 className="text-xl font-bold font-display text-dark-800 mb-6">Account Details</h2>
                  <form onSubmit={handleUpdateProfile} className="space-y-5 max-w-lg">
                    <div>
                      <label className="block text-xs font-semibold text-dark-600 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#FDF8F4] border border-rose-200 rounded-xl px-4 py-3 text-dark-800 text-sm focus:border-rose-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-dark-600 mb-1">Email Address</label>
                      <input 
                        type="email" 
                        value={user.email}
                        disabled
                        className="w-full bg-linen-100 border border-rose-100 rounded-xl px-4 py-3 text-dark-400 text-sm cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-dark-600 mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="10-digit mobile number"
                        className="w-full bg-[#FDF8F4] border border-rose-200 rounded-xl px-4 py-3 text-dark-800 text-sm focus:border-rose-500 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isUpdatingProfile}
                      className="px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-400 hover:from-rose-600 hover:to-rose-500 text-white font-semibold rounded-xl text-sm transition-all shadow-glow-rose disabled:opacity-50"
                    >
                      {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                </div>

                {/* Danger Zone: Delete Account */}
                {!isAdmin && (
                  <div className="pt-6 border-t border-rose-100">
                    <div className="bg-red-50/60 border border-red-200/80 rounded-2xl p-6 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center border border-red-200 shrink-0 mt-0.5">
                          <Trash2 size={18} className="text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-red-800 text-base">Delete Your Account</h3>
                          <p className="text-xs text-red-600/90 leading-relaxed mt-1">
                            Permanently delete your account and all associated data including profile details, saved delivery addresses, order history, custom requests, and reviews from our database.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleDeleteAccount}
                        disabled={isDeletingAccount}
                        className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-xs transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
                      >
                        {isDeletingAccount ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        Delete My Account & All Data
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* My Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold font-display text-dark-800 mb-4">My Orders</h2>
                {loadingOrders ? (
                  <div className="py-12 flex justify-center"><Loader2 className="animate-spin text-rose-500" size={32} /></div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-16 bg-white border border-rose-100 rounded-3xl text-dark-400 shadow-card">
                    <Package size={48} className="mx-auto text-rose-300 mb-3" />
                    <p className="font-semibold text-dark-800 text-lg">No orders placed yet</p>
                    <p className="text-xs text-dark-400 mt-1 mb-6">Explore our press-on nail collection to place your first order!</p>
                    <Link to="/shop" className="px-6 py-2.5 bg-rose-500 text-white rounded-xl text-xs font-semibold hover:bg-rose-600 transition-colors shadow-glow-rose">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order._id} className="bg-white border border-rose-100 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-rose-300 transition-all shadow-card">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-bold text-dark-800 text-lg">#{order.orderNumber}</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.orderStatus)}`}>
                              {order.orderStatus}
                            </span>
                          </div>
                          <div className="text-sm text-dark-400">
                            {formatDate(order.createdAt)} • {order.orderItems?.length || 0} items • <span className="font-semibold text-dark-800">{formatINR(order.totalPrice)}</span>
                          </div>
                        </div>
                        <Link to={`/order/${order._id}`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl hover:bg-rose-100 transition-colors text-sm font-semibold shrink-0">
                          Track Order <ChevronRight size={16} />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Custom Requests Tab */}
            {activeTab === 'custom-requests' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-xl font-bold font-display text-dark-800">My Custom Requests</h2>
                    <p className="text-xs text-dark-400 mt-0.5">Track your custom nail design orders and get status updates</p>
                  </div>
                  <Link
                    to="/custom-order"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-rose-400 hover:from-rose-600 hover:to-rose-500 text-white rounded-xl text-xs font-semibold transition-all shadow-glow-rose shrink-0"
                  >
                    <Palette size={15} /> New Custom Order
                  </Link>
                </div>

                {loadingCustomRequests ? (
                  <div className="py-12 flex justify-center"><Loader2 className="animate-spin text-rose-500" size={32} /></div>
                ) : customRequests.length === 0 ? (
                  <div className="text-center py-16 bg-white border border-rose-100 rounded-3xl text-dark-400 shadow-card">
                    <Palette size={48} className="mx-auto text-rose-300 mb-3" />
                    <p className="font-semibold text-dark-800 text-lg">No custom requests yet</p>
                    <p className="text-xs text-dark-400 mt-1 mb-6">Place a custom order for your dream nail design!</p>
                    <Link to="/custom-order" className="px-6 py-2.5 bg-rose-500 text-white rounded-xl text-xs font-semibold hover:bg-rose-600 transition-colors shadow-glow-rose">
                      Request Custom Design
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {customRequests.map(req => (
                      <div key={req._id} className="bg-white border border-rose-100 rounded-3xl p-6 hover:border-rose-300 transition-all shadow-card">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="font-bold text-dark-800">Custom Request</span>
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getCustomRequestStatusColor(req.status)}`}>
                                {getCustomRequestStatusIcon(req.status)}
                                {req.status}
                              </span>
                            </div>
                            <div className="text-sm text-dark-400 space-y-1">
                              <p><span className="font-medium text-dark-600">Submitted:</span> {formatDate(req.createdAt)}</p>
                              {req.nailShape && <p><span className="font-medium text-dark-600">Shape:</span> {req.nailShape} • <span className="font-medium text-dark-600">Length:</span> {req.nailLength}</p>}
                              {req.budgetRange && <p><span className="font-medium text-dark-600">Budget:</span> ₹{req.budgetRange}</p>}
                              {req.description && <p className="text-dark-400 line-clamp-2">{req.description}</p>}
                            </div>
                          </div>

                          {/* Reference Images */}
                          {req.referenceImages && req.referenceImages.length > 0 && (
                            <div className="flex gap-2 shrink-0">
                              {req.referenceImages.slice(0, 2).map((img, i) => (
                                <img key={i} src={img.url} alt="Reference" className="w-14 h-14 object-cover rounded-xl border border-rose-100" />
                              ))}
                              {req.referenceImages.length > 2 && (
                                <div className="w-14 h-14 rounded-xl border border-rose-100 bg-rose-50 flex items-center justify-center text-xs font-semibold text-rose-500">
                                  +{req.referenceImages.length - 2}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Admin Response Section */}
                        {(req.adminNotes || req.quotedPrice) && (
                          <div className="mt-4 pt-4 border-t border-rose-50">
                            <p className="text-xs font-semibold text-rose-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                              <CheckCircle size={12} /> Response from Anshika
                            </p>
                            {req.quotedPrice && (
                              <p className="text-sm font-bold text-dark-800 mb-1">
                                💅 Quoted Price: <span className="text-rose-500">₹{req.quotedPrice.toLocaleString('en-IN')}</span>
                              </p>
                            )}
                            {req.adminNotes && (
                              <p className="text-sm text-dark-500 bg-rose-50/60 rounded-xl p-3 border border-rose-100">{req.adminNotes}</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* My Addresses Tab */}
            {activeTab === 'addresses' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold font-display text-dark-800">My Addresses</h2>
                    <p className="text-xs text-dark-400 mt-0.5">Manage your saved delivery locations for fast checkout</p>
                  </div>
                  <button 
                    onClick={handleOpenAddAddress} 
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-rose-400 hover:from-rose-600 hover:to-rose-500 text-white rounded-xl text-xs font-semibold transition-all shadow-glow-rose"
                  >
                    <Plus size={16} /> Add New Address
                  </button>
                </div>

                {loadingAddresses ? (
                  <div className="py-12 flex justify-center"><Loader2 className="animate-spin text-rose-500" size={32} /></div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-16 bg-white border border-rose-100 rounded-3xl text-dark-400 shadow-card">
                    <MapPin size={48} className="mx-auto text-rose-300 mb-3" />
                    <p className="font-semibold text-dark-800 text-lg">No saved addresses</p>
                    <p className="text-xs text-dark-400 mt-1 mb-6">Add an address to save time during checkout!</p>
                    <button 
                      onClick={handleOpenAddAddress}
                      className="px-6 py-2.5 bg-rose-500 text-white rounded-xl text-xs font-semibold hover:bg-rose-600 transition-colors shadow-glow-rose"
                    >
                      + Add Address Now
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map(addr => (
                      <AddressCard
                        key={addr._id || addr.id}
                        address={addr}
                        selectable={false}
                        onEdit={handleOpenEditAddress}
                        onDelete={handleDeleteAddress}
                        onSetDefault={handleSetDefaultAddress}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSave={handleSaveModalAddress}
        initialData={editingAddress}
      />
      
      <Footer />
    </div>
  );
}
