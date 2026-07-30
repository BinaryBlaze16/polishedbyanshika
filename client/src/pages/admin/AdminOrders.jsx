import React, { useState, useEffect } from "react";
import { Search, Filter, Eye, CheckCircle2, Clock, Truck, ShieldCheck, X, Send, Copy, ExternalLink } from "lucide-react";
import adminService from "../../services/adminService";
import { formatINR, formatDate, getStatusColor, getStatusIcon } from "../../utils/formatCurrency";
import toast from "react-hot-toast";

const AdminOrders = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Selected Order Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Status & Tracking Form State
  const [newStatus, setNewStatus] = useState("");
  const [courierPartner, setCourierPartner] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [statusNote, setStatusNote] = useState("");

  const tabs = ["All", "Pending", "Accepted", "Preparing", "Packed", "Shipped", "Out For Delivery", "Delivered", "Cancelled"];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllOrders();
      if (res && res.success) {
        setOrders(res.orders || res.data || []);
      }
    } catch (err) {
      console.error("Fetch orders error", err);
      toast.error("Failed to load live orders");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (orderId) => {
    try {
      const res = await adminService.verifyPayment(orderId);
      if (res && res.success) {
        toast.success("UPI UTR Payment Verified & Accepted! 💳✅");
        fetchOrders();
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, orderStatus: "Accepted", paymentDetails: { ...selectedOrder.paymentDetails, isPaid: true } });
        }
      }
    } catch (err) {
      toast.error("Payment verification failed");
    }
  };

  const handleUpdateStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setIsUpdatingStatus(true);
    try {
      const payload = {
        orderStatus: newStatus || selectedOrder.orderStatus,
        courierPartner,
        trackingNumber,
        note: statusNote,
      };
      const res = await adminService.updateOrderStatus(selectedOrder._id, payload);
      if (res && res.success) {
        toast.success(`Order status updated to "${newStatus || selectedOrder.orderStatus}" 🚀`);
        fetchOrders();
        setSelectedOrder(null);
      }
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesTab = activeTab === "All" || o.orderStatus === activeTab;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      o.orderNumber?.toLowerCase().includes(q) ||
      o.shippingAddress?.fullName?.toLowerCase().includes(q) ||
      o.shippingAddress?.phone?.includes(q) ||
      o.paymentDetails?.utrNumber?.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-dark-800">Customer Orders Management</h1>
          <p className="text-dark-400 text-sm">Verify UPI UTRs, inspect finger size measurements & update live order statuses.</p>
        </div>
        <button onClick={fetchOrders} className="btn-secondary text-sm">
          Refresh Orders
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="glass-card p-6 border border-rose-100 space-y-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab
                  ? "bg-rose-500 text-dark-800 shadow-glow-rose"
                  : "bg-white text-dark-400 hover:text-dark-800 border border-rose-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" size={18} />
          <input
            type="text"
            placeholder="Search by Order #, Customer Name, Phone, or UTR number..."
            className="input-dark w-full pl-10 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="py-16 text-center text-dark-400">Loading customer orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-dark-300">
            <Clock size={40} className="mx-auto mb-2 opacity-30" />
            <p>No orders found for selected status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-dark-400 border-b border-rose-100 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="pb-3">Order #</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Shapes & Sizes</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Payment / UTR</th>
                  <th className="pb-3">Order Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.map((order) => {
                  const isPaid = order.paymentDetails?.isPaid;
                  const utr = order.paymentDetails?.utrNumber;

                  return (
                    <tr key={order._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 font-mono font-bold text-rose-500">{order.orderNumber || order._id?.slice(-6)}</td>
                      <td className="py-4">
                        <div className="font-semibold text-dark-800">{order.shippingAddress?.fullName || "Customer"}</div>
                        <div className="text-xs text-dark-400">{order.shippingAddress?.phone}</div>
                        <div className="text-[11px] text-dark-300 truncate max-w-[150px]">{order.shippingAddress?.city}, {order.shippingAddress?.pincode}</div>
                      </td>
                      <td className="py-4">
                        <div className="flex flex-wrap gap-1">
                          {order.orderItems?.map((item, idx) => (
                            <span key={idx} className="text-[11px] bg-rose-50 border border-rose-500/20 text-rose-500 px-2 py-0.5 rounded-full">
                              {item.selectedShape} ({item.selectedLength}) - {item.selectedSize}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 font-bold text-gold-500">{formatINR(order.totalPrice)}</td>
                      <td className="py-4">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full font-medium">
                            <ShieldCheck size={14} /> Paid & Verified
                          </span>
                        ) : utr ? (
                          <div className="space-y-1">
                            <div className="text-xs font-mono text-dark-400">UTR: {utr}</div>
                            <button
                              onClick={() => handleVerifyPayment(order._id)}
                              className="text-[11px] px-2.5 py-0.5 rounded bg-amber-500/20 text-gold-400 hover:bg-amber-500 hover:text-black transition-colors border border-amber-500/30 font-semibold"
                            >
                              Approve UTR
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-dark-400 bg-white px-2 py-1 rounded border border-rose-50">Pending Payment</span>
                        )}
                      </td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.orderStatus)}`}>
                          {getStatusIcon(order.orderStatus)} {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setNewStatus(order.orderStatus);
                            setCourierPartner(order.courierPartner || "");
                            setTrackingNumber(order.trackingNumber || "");
                          }}
                          className="btn-primary text-xs py-1.5 px-3 inline-flex items-center gap-1 shadow-glow-rose"
                        >
                          <Eye size={14} /> Manage Order
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FULL DETAILED ORDER & STATUS UPDATE MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl glass-card border border-rose-100 p-6 md:p-8 rounded-3xl space-y-6 my-8 animate-in fade-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-rose-100 pb-4">
              <div>
                <span className="text-xs text-rose-500 font-mono font-bold uppercase tracking-wider">Order Fulfill Panel</span>
                <h2 className="text-2xl font-bold font-display text-dark-800">{selectedOrder.orderNumber}</h2>
                <p className="text-xs text-dark-400">Placed on {formatDate(selectedOrder.createdAt)}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 text-dark-400 hover:text-dark-800 rounded-full bg-white">
                <X size={20} />
              </button>
            </div>

            {/* Customer Details & Shipping Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.02] border border-rose-50 rounded-2xl p-5">
              <div>
                <h4 className="text-xs font-semibold uppercase text-rose-500 tracking-wider mb-2">Customer & Contact</h4>
                <p className="text-sm font-bold text-dark-800">{selectedOrder.shippingAddress?.fullName}</p>
                <p className="text-xs text-dark-400 mt-1">📞 {selectedOrder.shippingAddress?.phone}</p>
                <p className="text-xs text-dark-400 mt-1">📧 {selectedOrder.user?.email || "N/A"}</p>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase text-rose-500 tracking-wider mb-2">Delivery Address</h4>
                <p className="text-xs text-dark-700 leading-relaxed font-medium">
                  {selectedOrder.shippingAddress?.addressLine1 || selectedOrder.shippingAddress?.houseNumber}, {selectedOrder.shippingAddress?.addressLine2 || selectedOrder.shippingAddress?.street && `${selectedOrder.shippingAddress?.street}, `}
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} — <strong className="text-rose-600">{selectedOrder.shippingAddress?.pincode}</strong>
                </p>
              </div>
            </div>

            {/* Custom Finger Size Measurements & Items */}
            <div>
              <h4 className="text-xs font-semibold uppercase text-rose-500 tracking-wider mb-3">Order Items & Nail Specifications</h4>
              <div className="space-y-3">
                {selectedOrder.orderItems?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white/[0.03] border border-rose-100 rounded-2xl p-4">
                    <div className="flex items-center gap-4">
                      {item.image && <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-xl border border-rose-100" />}
                      <div>
                        <p className="text-sm font-bold text-dark-800">{item.name}</p>
                        <div className="flex flex-wrap gap-2 text-xs text-dark-400 mt-1">
                          <span className="bg-rose-50 px-2 py-0.5 rounded border border-rose-500/20">Shape: <strong>{item.selectedShape}</strong></span>
                          <span className="bg-rose-50 px-2 py-0.5 rounded border border-rose-500/20">Length: <strong>{item.selectedLength}</strong></span>
                          <span className="bg-rose-50 px-2 py-0.5 rounded border border-rose-500/20">Size: <strong>{item.selectedSize}</strong></span>
                        </div>

                        {/* If Custom Finger mm sizes provided */}
                        {item.customSizeInMm && (
                          <div className="mt-2 text-xs bg-black/40 border border-amber-500/20 p-2 rounded-lg text-gold-400">
                            <strong>Custom Finger Sizes (mm):</strong> Thumb: {item.customSizeInMm.thumb || "-"}mm | Index: {item.customSizeInMm.index || "-"}mm | Middle: {item.customSizeInMm.middle || "-"}mm | Ring: {item.customSizeInMm.ring || "-"}mm | Pinky: {item.customSizeInMm.pinky || "-"}mm
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-dark-400">Qty: {item.qty}</p>
                      <p className="text-sm font-bold text-gold-500">{formatINR(item.price * item.qty)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment & UTR Section */}
            <div className="bg-black/40 border border-rose-100 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-dark-400">Payment Method: <strong>{selectedOrder.paymentMethod}</strong></span>
                <p className="text-sm font-semibold text-dark-800 mt-1">
                  UTR: <span className="font-mono text-rose-500">{selectedOrder.paymentDetails?.utrNumber || "Not provided"}</span>
                </p>
              </div>
              {!selectedOrder.paymentDetails?.isPaid && selectedOrder.paymentDetails?.utrNumber && (
                <button
                  onClick={() => handleVerifyPayment(selectedOrder._id)}
                  className="btn-gold text-xs px-4 py-2 flex items-center gap-1 font-bold shadow-glow-gold"
                >
                  <ShieldCheck size={16} /> 1-Click Approve UTR
                </button>
              )}
            </div>

            {/* 1-Click Order Status Stepper & Tracking Form */}
            <form onSubmit={handleUpdateStatusSubmit} className="bg-rose-950/20 border border-rose-500/20 p-6 rounded-2xl space-y-4">
              <h4 className="text-sm font-bold text-dark-800 flex items-center gap-2">
                <Truck size={18} className="text-rose-500" /> 1-Click Live Status Update & Courier Tracking
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-dark-400 mb-1">New Order Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="input-dark w-full text-sm bg-black/30"
                  >
                    {tabs.filter((t) => t !== "All").map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-dark-400 mb-1">Courier Partner (e.g. Delhivery, BlueDart)</label>
                  <input
                    type="text"
                    placeholder="Delhivery / BlueDart"
                    value={courierPartner}
                    onChange={(e) => setCourierPartner(e.target.value)}
                    className="input-dark w-full text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-dark-400 mb-1">AWB Tracking Number / ID</label>
                <input
                  type="text"
                  placeholder="e.g. TRACK891203IN"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="input-dark w-full text-sm font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setSelectedOrder(null)} className="btn-ghost text-xs">
                  Cancel
                </button>
                <button type="submit" disabled={isUpdatingStatus} className="btn-primary text-xs px-6 py-2.5 flex items-center gap-2">
                  {isUpdatingStatus ? "Updating..." : "Save & Update Live Status"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
