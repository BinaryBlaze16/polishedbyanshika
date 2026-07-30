import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import { Plus, Trash2, Edit2, Check, X, Sparkles, Loader2, Upload } from "lucide-react";
import toast from "react-hot-toast";

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editBannerId, setEditBannerId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    link: "",
    order: 0,
    type: "hero",
    isActive: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await adminService.getBanners();
      if (res && res.success) {
        setBanners(res.data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load banners");
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const openCreateModal = () => {
    setEditBannerId(null);
    setFormData({
      title: "",
      subtitle: "",
      link: "",
      order: 0,
      type: "hero",
      isActive: true,
    });
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const openEditModal = (banner) => {
    setEditBannerId(banner._id);
    setFormData({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      link: banner.link || "",
      order: banner.order || 0,
      type: banner.type || "hero",
      isActive: banner.isActive !== undefined ? banner.isActive : true,
    });
    setImageFile(null);
    setImagePreview(banner.image?.url || null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const toastId = toast.loading(editBannerId ? "Updating banner..." : "Creating banner...");
    
    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("subtitle", formData.subtitle);
      fd.append("link", formData.link);
      fd.append("order", formData.order);
      fd.append("type", formData.type);
      fd.append("isActive", formData.isActive);

      if (imageFile) {
        fd.append("image", imageFile);
      } else if (editBannerId && imagePreview) {
        fd.append("imageUrl", imagePreview);
      }

      let res;
      if (editBannerId) {
        res = await adminService.updateBanner(editBannerId, fd);
      } else {
        res = await adminService.createBanner(fd);
      }

      if (res && res.success) {
        toast.success(editBannerId ? "Banner updated! 🎨" : "Banner created! 🎉", { id: toastId });
        setShowModal(false);
        fetchBanners();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save banner", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    try {
      const res = await adminService.deleteBanner(id);
      if (res && res.success) {
        toast.success("Banner deleted successfully");
        fetchBanners();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete banner");
    }
  };

  const handleToggleActive = async (banner) => {
    try {
      const fd = new FormData();
      fd.append("isActive", !banner.isActive);
      const res = await adminService.updateBanner(banner._id, fd);
      if (res && res.success) {
        toast.success(`Banner ${!banner.isActive ? "activated" : "deactivated"}`);
        fetchBanners();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to toggle banner status");
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
          <h1 className="text-3xl font-display font-bold text-dark-800">Homepage Banners</h1>
          <p className="text-dark-400 text-sm mt-1">Manage heroic sliders, promo banners, and category tiles.</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary flex items-center gap-2 text-sm shadow-glow-rose">
          <Plus size={16} /> Add Banner
        </button>
      </div>

      {/* Grid List */}
      {banners.length === 0 ? (
        <div className="glass-card p-12 text-center text-dark-300 border border-rose-100">
          <Sparkles size={36} className="mx-auto mb-2 opacity-40" />
          <p>No banners uploaded yet. Add some to decorate the shop front!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div key={banner._id} className="glass-card overflow-hidden border border-rose-100 flex flex-col justify-between group hover:border-rose-500/30 transition-all duration-300">
              <div className="relative aspect-[21/9] bg-[#FDF8F4] overflow-hidden">
                <img
                  src={banner.image?.url || "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600"}
                  alt={banner.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 text-[10px] uppercase font-bold tracking-widest bg-black/75 backdrop-blur-sm text-gold-500 px-2 py-0.5 rounded-full border border-amber-400/20">
                  {banner.type}
                </span>
                <button
                  onClick={() => handleToggleActive(banner)}
                  className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-0.5 rounded-full border backdrop-blur-sm transition-all ${
                    banner.isActive
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "bg-rose-50 text-rose-500 border-rose-500/30"
                  }`}
                >
                  {banner.isActive ? "Active" : "Inactive"}
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-dark-800 text-lg tracking-tight line-clamp-1">{banner.title}</h3>
                  {banner.subtitle && <p className="text-dark-400 text-xs mt-1 line-clamp-2">{banner.subtitle}</p>}
                  {banner.link && (
                    <div className="text-[10px] text-rose-500 font-mono mt-2 truncate bg-rose-500/5 p-1 px-2 rounded w-max border border-rose-500/10">
                      🔗 {banner.link}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-rose-50 text-xs text-dark-400">
                  <span>Order Placement: <strong className="text-dark-800">{banner.order}</strong></span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(banner)}
                      className="p-2 rounded-lg bg-white hover:bg-rose-50 text-slate-200 transition-colors"
                      title="Edit Banner"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="p-2 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-dark-800 text-rose-500 transition-colors"
                      title="Delete Banner"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-rose-900/30 rounded-3xl w-full max-w-lg p-6 md:p-8 space-y-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-44 h-44 bg-rose-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex justify-between items-center border-b border-rose-900/10 pb-4">
              <h2 className="text-xl font-bold text-dark-800 flex items-center gap-2">
                <Sparkles size={18} className="text-rose-500" />
                {editBannerId ? "Modify Banner Set" : "Upload New Banner Design"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-dark-400 hover:text-dark-800 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider">Banner Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Luxury Handcrafted Sets"
                  className="input-dark w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider">Subtitle / Promo Tagline</label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  placeholder="e.g. Apply in minutes. Lasts for weeks."
                  className="input-dark w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider">Banner Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="input-dark w-full text-dark-800"
                  >
                    <option value="hero">Hero Slider</option>
                    <option value="promotional">Promo Banner</option>
                    <option value="category">Category Card</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider">Display Order</label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="input-dark w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider">Redirect Link</label>
                <input
                  type="text"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  placeholder="e.g. /shop or /custom-order"
                  className="input-dark w-full"
                />
              </div>

              {/* Image upload */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider block">Banner Image</label>
                <div className="border border-dashed border-rose-200 rounded-2xl p-4 text-center hover:bg-white transition-all relative min-h-32 flex flex-col justify-center items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required={!editBannerId && !imagePreview}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {imagePreview ? (
                    <div className="space-y-2">
                      <img src={imagePreview} alt="Preview" className="h-20 w-44 object-cover rounded-lg border border-rose-100" />
                      <p className="text-xs text-rose-500">Click or drag to replace image</p>
                    </div>
                  ) : (
                    <>
                      <Upload size={24} className="text-dark-300 mb-2" />
                      <p className="text-dark-800 text-xs font-medium">Select banner design file</p>
                      <p className="text-[10px] text-dark-400 mt-0.5">JPG, PNG, WebP up to 5MB</p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4.5 w-4.5 text-rose-600 focus:ring-rose-500/20 border-rose-200 bg-[#FDF8F4] rounded"
                />
                <label htmlFor="isActive" className="text-xs font-semibold text-dark-400 cursor-pointer">
                  Activate Banner Instantly
                </label>
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
                  {editBannerId ? "Save Changes" : "Publish Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBanners;
