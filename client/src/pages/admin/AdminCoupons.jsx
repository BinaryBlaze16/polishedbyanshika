import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import { Plus, Trash2, Edit2, Check, X, Tag, Loader2, Calendar } from "lucide-react";
import { formatINR, formatDate } from "../../utils/formatCurrency";
import toast from "react-hot-toast";

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editCouponId, setEditCouponId] = useState(null);

  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: 0,
    minOrderValue: 0,
    maxDiscount: "",
    usageLimit: "",
    expiresAt: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAllCoupons();
      if (res && res.success) {
        setCoupons(res.data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openCreateModal = () => {
    setEditCouponId(null);
    setFormData({
      code: "",
      discountType: "percentage",
      discountValue: 0,
      minOrderValue: 0,
      maxDiscount: "",
      usageLimit: "",
      expiresAt: "",
      description: "",
      isActive: true,
    });
    setShowModal(true);
  };

  const openEditModal = (coupon) => {
    setEditCouponId(coupon._id);
    setFormData({
      code: coupon.code || "",
      discountType: coupon.discountType || "percentage",
      discountValue: coupon.discountValue || 0,
      minOrderValue: coupon.minOrderValue || 0,
      maxDiscount: coupon.maxDiscount !== undefined && coupon.maxDiscount !== null ? coupon.maxDiscount : "",
      usageLimit: coupon.usageLimit !== undefined && coupon.usageLimit !== null ? coupon.usageLimit : "",
      expiresAt: coupon.expiresAt ? coupon.expiresAt.substring(0, 10) : "",
      description: coupon.description || "",
      isActive: coupon.isActive !== undefined ? coupon.isActive : true,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const toastId = toast.loading(editCouponId ? "Updating coupon..." : "Creating coupon...");

    try {
      const payload = {
        ...formData,
        code: formData.code.toUpperCase(),
        discountValue: Number(formData.discountValue),
        minOrderValue: Number(formData.minOrderValue),
        maxDiscount: formData.maxDiscount !== "" ? Number(formData.maxDiscount) : null,
        usageLimit: formData.usageLimit !== "" ? Number(formData.usageLimit) : null,
        expiresAt: formData.expiresAt || null,
      };

      let res;
      if (editCouponId) {
        res = await adminService.updateCoupon(editCouponId, payload);
      } else {
        res = await adminService.createCoupon(payload);
      }

      if (res && res.success) {
        toast.success(editCouponId ? "Coupon updated! 🏷️" : "Coupon created! 🏷️", { id: toastId });
        setShowModal(false);
        fetchCoupons();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save coupon", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const res = await adminService.deleteCoupon(id);
      if (res && res.success) {
        toast.success("Coupon deleted successfully");
        fetchCoupons();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete coupon");
    }
  };

  const handleToggleActive = async (coupon) => {
    try {
      const res = await adminService.updateCoupon(coupon._id, {
        isActive: !coupon.isActive,
      });
      if (res && res.success) {
        toast.success(`Coupon ${!coupon.isActive ? "activated" : "deactivated"}`);
        fetchCoupons();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to toggle coupon status");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-dark-800">Promo Coupons</h1>
          <p className="text-dark-400 text-sm mt-1">Generate discount vouchers, percentage slashes, and minimum purchase rewards.</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary flex items-center gap-2 text-sm shadow-glow-rose">
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      {/* Table Container */}
      <div className="glass-card p-6 border border-rose-100 overflow-hidden">
        {coupons.length === 0 ? (
          <div className="py-12 text-center text-dark-300">
            <Tag size={36} className="mx-auto mb-2 opacity-40" />
            <p>No coupons found. Create your first promo code to boost sales!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-dark-400 border-b border-rose-100 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="pb-3">Coupon Code</th>
                  <th className="pb-3">Details / Description</th>
                  <th className="pb-3">Discount Rate</th>
                  <th className="pb-3">Min Order</th>
                  <th className="pb-3">Usage Statistics</th>
                  <th className="pb-3">Expires On</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 font-mono font-bold text-rose-500 text-base">{coupon.code}</td>
                    <td className="py-4 text-dark-400 text-xs max-w-xs truncate">{coupon.description || "—"}</td>
                    <td className="py-4">
                      <span className="font-semibold text-dark-800">
                        {coupon.discountType === "percentage" ? `${coupon.discountValue}% Off` : formatINR(coupon.discountValue)}
                      </span>
                      {coupon.maxDiscount && (
                        <div className="text-[10px] text-dark-300 mt-0.5">Cap: {formatINR(coupon.maxDiscount)}</div>
                      )}
                    </td>
                    <td className="py-4 text-dark-400">{coupon.minOrderValue ? formatINR(coupon.minOrderValue) : "No Min"}</td>
                    <td className="py-4 text-xs">
                      <span className="text-gold-500 font-semibold">{coupon.usedCount}</span>
                      <span className="text-dark-300"> / {coupon.usageLimit || "∞"} used</span>
                    </td>
                    <td className="py-4 text-dark-400 text-xs">
                      {coupon.expiresAt ? (
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> {formatDate(coupon.expiresAt)}
                        </span>
                      ) : (
                        "Never"
                      )}
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => handleToggleActive(coupon)}
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border backdrop-blur-sm transition-all ${
                          coupon.isActive
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-rose-50 text-rose-500 border-rose-500/30"
                        }`}
                      >
                        {coupon.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(coupon)}
                          className="p-2 rounded-lg bg-white hover:bg-rose-50 text-slate-200 transition-colors"
                          title="Edit Coupon"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon._id)}
                          className="p-2 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-dark-800 text-rose-500 transition-colors"
                          title="Delete Coupon"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-rose-900/30 rounded-3xl w-full max-w-lg p-6 md:p-8 space-y-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-44 h-44 bg-rose-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex justify-between items-center border-b border-rose-900/10 pb-4">
              <h2 className="text-xl font-bold text-dark-800 flex items-center gap-2">
                <Tag size={18} className="text-rose-500" />
                {editCouponId ? "Modify Promo Coupon" : "Create New Promo Coupon"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-dark-400 hover:text-dark-800 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider">Coupon Code</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    required
                    placeholder="e.g. LOVE20"
                    className="input-dark w-full uppercase"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider">Discount Type</label>
                  <select
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleInputChange}
                    className="input-dark w-full text-dark-800"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Flat Rate (₹)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider">Discount Value</label>
                  <input
                    type="number"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="input-dark w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider">Min Order Value (₹)</label>
                  <input
                    type="number"
                    name="minOrderValue"
                    value={formData.minOrderValue}
                    onChange={handleInputChange}
                    min="0"
                    className="input-dark w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider">
                    Max Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    name="maxDiscount"
                    value={formData.maxDiscount}
                    onChange={handleInputChange}
                    disabled={formData.discountType === "fixed"}
                    placeholder={formData.discountType === "fixed" ? "N/A" : "Unlimited"}
                    min="0"
                    className="input-dark w-full disabled:opacity-40"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider">Usage Limit</label>
                  <input
                    type="number"
                    name="usageLimit"
                    value={formData.usageLimit}
                    onChange={handleInputChange}
                    placeholder="Unlimited"
                    min="1"
                    className="input-dark w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider">Expires On</label>
                  <input
                    type="date"
                    name="expiresAt"
                    value={formData.expiresAt}
                    onChange={handleInputChange}
                    className="input-dark w-full text-dark-800"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4.5 w-4.5 text-rose-600 focus:ring-rose-500/20 border-rose-200 bg-[#FDF8F4] rounded"
                  />
                  <label htmlFor="isActive" className="text-xs font-semibold text-dark-400 cursor-pointer">
                    Enable Coupon Code
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider">Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="e.g. 20% off for new users during Diwali"
                  className="input-dark w-full"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-rose-900/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary text-xs flex items-center gap-1.5 shadow-glow-rose disabled:opacity-50"
                >
                  {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={14} />}
                  {editCouponId ? "Save Changes" : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
