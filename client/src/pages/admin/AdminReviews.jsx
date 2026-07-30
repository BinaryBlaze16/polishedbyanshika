import React, { useEffect, useState } from "react";
import { Star, CheckCircle, XCircle, Trash2, Search, Loader2, MessageSquare, AlertCircle } from "lucide-react";
import adminService from "../../services/adminService";
import { formatDate } from "../../utils/formatCurrency";
import toast from "react-hot-toast";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllReviews();
      if (res && res.success) {
        setReviews(res.reviews || res.data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load customer reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await adminService.approveReview(id);
      if (res && res.success) {
        toast.success("Review approved and published! ⭐");
        fetchReviews();
      }
    } catch (err) {
      toast.error("Failed to approve review");
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await adminService.rejectReview(id);
      if (res && res.success) {
        toast.success("Review unpublished");
        fetchReviews();
      }
    } catch (err) {
      toast.error("Failed to reject review");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this review?")) return;
    try {
      const res = await adminService.deleteReview(id);
      if (res && res.success) {
        toast.success("Review deleted");
        fetchReviews();
      }
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesStatus =
      filterStatus === "All" ||
      (filterStatus === "Approved" && r.isApproved) ||
      (filterStatus === "Pending" && !r.isApproved);
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      r.comment?.toLowerCase().includes(q) ||
      r.user?.name?.toLowerCase().includes(q) ||
      r.product?.name?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-dark-800">Customer Product Reviews</h1>
          <p className="text-dark-400 text-sm mt-1">
            Moderate submitted customer reviews before they appear live on the store.
          </p>
        </div>
        <button onClick={fetchReviews} className="btn-secondary text-sm">
          Refresh Reviews
        </button>
      </div>

      {/* Filter and Search */}
      <div className="glass-card p-6 border border-rose-100 space-y-4">
        <div className="flex flex-wrap gap-2">
          {["All", "Pending", "Approved"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                filterStatus === st
                  ? "bg-rose-500 text-white shadow-glow-rose"
                  : "bg-white text-dark-400 hover:text-dark-800 border border-rose-100"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" size={18} />
          <input
            type="text"
            placeholder="Search by customer name, product, or review text..."
            className="input-dark w-full pl-10 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="py-16 text-center text-dark-400 flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
            <span>Loading database reviews...</span>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="py-16 text-center text-dark-300">
            <MessageSquare size={40} className="mx-auto mb-2 opacity-30" />
            <p>No reviews found matching criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-dark-400 border-b border-rose-100 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Rating & Comment</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50">
                {filteredReviews.map((rev) => (
                  <tr key={rev._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        {rev.product?.images?.[0] && (
                          <img
                            src={rev.product.images[0].url || rev.product.images[0]}
                            alt={rev.product.name}
                            className="w-10 h-10 object-cover rounded-xl border border-rose-100"
                          />
                        )}
                        <span className="font-semibold text-dark-800">{rev.product?.name || "Product"}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="font-bold text-dark-800">{rev.user?.name || "Customer"}</div>
                      <div className="text-xs text-dark-400">{rev.user?.email}</div>
                    </td>
                    <td className="py-4 max-w-md">
                      <div className="flex items-center gap-1 mb-1 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < rev.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                          />
                        ))}
                        <span className="text-xs text-dark-400 ml-1 font-bold">({rev.rating}/5)</span>
                      </div>
                      {rev.title && <p className="text-xs font-bold text-dark-800">{rev.title}</p>}
                      <p className="text-xs text-dark-600 leading-relaxed mt-0.5">{rev.comment}</p>
                    </td>
                    <td className="py-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                          rev.isApproved
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                            : "bg-amber-50 text-amber-600 border-amber-200"
                        }`}
                      >
                        {rev.isApproved ? "Approved & Live" : "Pending Review"}
                      </span>
                    </td>
                    <td className="py-4 text-dark-400 text-xs">{formatDate(rev.createdAt)}</td>
                    <td className="py-4 text-right space-x-2">
                      {!rev.isApproved ? (
                        <button
                          onClick={() => handleApprove(rev._id)}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg text-xs font-semibold border border-emerald-200 transition-colors"
                          title="Approve Review"
                        >
                          Approve
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReject(rev._id)}
                          className="px-3 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white rounded-lg text-xs font-semibold border border-amber-200 transition-colors"
                          title="Unpublish Review"
                        >
                          Unpublish
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(rev._id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg border border-rose-100 transition-colors"
                        title="Delete Review"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
