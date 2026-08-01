import React, { useEffect, useState } from "react";
import {
  Star, CheckCircle, XCircle, Trash2, Search, Loader2,
  MessageSquare, Clock, AlertCircle, X, ExternalLink, Package,
  ZoomIn
} from "lucide-react";
import reviewService from "../../services/reviewService";
import { formatDate } from "../../utils/formatCurrency";
import toast from "react-hot-toast";

const STATUS_TABS = ["All", "Pending", "Approved", "Rejected"];

const StatusBadge = ({ status }) => {
  const cfg = {
    Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Rejected: "bg-red-50 text-red-600 border-red-200",
    Pending:  "bg-amber-50 text-amber-700 border-amber-200",
  }[status] || "bg-gray-100 text-gray-600 border-gray-200";

  const icon = { Approved: "✓", Rejected: "✗", Pending: "⏳" }[status] || "–";
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg}`}>
      {icon} {status}
    </span>
  );
};

function StarRow({ rating }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(n => (
        <Star key={n} size={13}
          className={n <= rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}
        />
      ))}
    </span>
  );
}

// Simple image lightbox
function Lightbox({ src, onClose }) {
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-3xl max-h-[90vh]">
        <img src={src} alt="" className="max-w-full max-h-[85vh] rounded-xl object-contain" />
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [pendingCount, setPendingCount] = useState(0);
  const [lightboxSrc, setLightboxSrc] = useState(null);

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await reviewService.getAllReviewsAdmin();
      if (res?.success) {
        setReviews(res.reviews || res.data || []);
        setPendingCount(res.pendingCount || 0);
      }
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await reviewService.approveReview(id);
      toast.success("Review approved & published ✅");
      fetchReviews();
    } catch { toast.error("Failed to approve"); }
  };

  const handleReject = async (id) => {
    try {
      await reviewService.rejectReview(id);
      toast.success("Review rejected");
      fetchReviews();
    } catch { toast.error("Failed to reject"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this review? This cannot be undone.")) return;
    try {
      await reviewService.deleteReview(id);
      toast.success("Review deleted");
      fetchReviews();
    } catch { toast.error("Failed to delete"); }
  };

  const filtered = reviews.filter(r => {
    const matchTab = activeTab === "All" || r.status === activeTab;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      r.comment?.toLowerCase().includes(q) ||
      r.user?.name?.toLowerCase().includes(q) ||
      r.product?.name?.toLowerCase().includes(q) ||
      r.title?.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-display font-bold text-dark-800">Customer Reviews</h1>
            {pendingCount > 0 && (
              <span className="px-2.5 py-1 bg-amber-500 text-white text-xs font-bold rounded-full animate-pulse">
                {pendingCount} Pending
              </span>
            )}
          </div>
          <p className="text-dark-400 text-sm mt-1">
            Moderate, approve, or reject customer reviews before they go live.
          </p>
        </div>
        <button onClick={fetchReviews} className="btn-secondary text-sm">
          Refresh
        </button>
      </div>

      {/* Filter Tabs + Search */}
      <div className="glass-card p-5 border border-rose-100 space-y-4">
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === tab
                  ? "bg-rose-500 text-white shadow-glow-rose"
                  : "bg-white text-dark-400 hover:text-dark-800 border border-rose-100"
              }`}
            >
              {tab}
              {tab === "Pending" && pendingCount > 0 && (
                <span className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${
                  activeTab === "Pending" ? "bg-white text-rose-500" : "bg-amber-400 text-white"
                }`}>{pendingCount}</span>
              )}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" size={16} />
          <input
            type="text"
            placeholder="Search by customer, product, or review text..."
            className="input-dark w-full pl-10 text-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="py-16 text-center flex flex-col items-center gap-3 text-dark-400">
            <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
            <span className="text-sm">Loading reviews...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <MessageSquare size={40} className="mx-auto mb-3 text-dark-200" />
            <p className="text-dark-400 text-sm">No reviews found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(rev => (
              <div key={rev._id} className="bg-white rounded-2xl border border-rose-100 p-5 hover:shadow-sm transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">

                  {/* Product info */}
                  <div className="flex items-start gap-3 sm:w-48 shrink-0">
                    {rev.product?.images?.[0] ? (
                      <img
                        src={rev.product.images[0].url || rev.product.images[0]}
                        alt={rev.product.name}
                        className="w-12 h-12 rounded-xl object-cover border border-rose-100 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                        <Package size={18} className="text-rose-300" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-dark-800 text-sm leading-snug line-clamp-2">
                        {rev.product?.name || "Product"}
                      </p>
                      {rev.order?.orderNumber && (
                        <p className="text-xs text-dark-400 mt-0.5">#{rev.order.orderNumber}</p>
                      )}
                    </div>
                  </div>

                  {/* Review body */}
                  <div className="flex-1 min-w-0">
                    {/* Customer + rating row */}
                    <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
                      <div>
                        <p className="font-bold text-dark-800 text-sm">{rev.user?.name || "Customer"}</p>
                        <p className="text-xs text-dark-400">{rev.user?.email}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <StatusBadge status={rev.status} />
                        <span className="text-xs text-dark-400">{formatDate(rev.createdAt)}</span>
                      </div>
                    </div>

                    {/* Stars + title */}
                    <div className="flex items-center gap-2 mb-1">
                      <StarRow rating={rev.rating} />
                      <span className="text-xs font-bold text-amber-600">{rev.rating}/5</span>
                      {rev.isVerifiedPurchase && (
                        <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5 font-semibold">
                          ✓ Verified Purchase
                        </span>
                      )}
                    </div>

                    {rev.title && (
                      <p className="text-sm font-semibold text-dark-800 mb-1">"{rev.title}"</p>
                    )}
                    <p className="text-sm text-dark-600 leading-relaxed">{rev.comment}</p>

                    {/* Review images */}
                    {rev.images?.length > 0 && (
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {rev.images.map((url, i) => (
                          <button
                            key={i}
                            onClick={() => setLightboxSrc(url)}
                            className="relative w-16 h-16 rounded-xl overflow-hidden border border-rose-100 hover:border-rose-400 transition-colors group"
                          >
                            <img src={url} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <ZoomIn size={14} className="text-white" />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4 flex-wrap">
                      {rev.status !== "Approved" && (
                        <button
                          onClick={() => handleApprove(rev._id)}
                          className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
                        >
                          <CheckCircle size={13} /> Approve
                        </button>
                      )}
                      {rev.status !== "Rejected" && (
                        <button
                          onClick={() => handleReject(rev._id)}
                          className="px-3.5 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-500 hover:text-white border border-amber-200 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
                        >
                          <XCircle size={13} /> Reject
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(rev._id)}
                        className="px-3.5 py-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white border border-red-200 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
    </div>
  );
};

export default AdminReviews;
