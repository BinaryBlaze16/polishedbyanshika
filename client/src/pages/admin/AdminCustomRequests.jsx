import React, { useState, useEffect } from "react";
import { Search, Eye, MessageCircle, ExternalLink, Sparkles, X, CheckCircle, Clock } from "lucide-react";
import adminService from "../../services/adminService";
import { formatINR, formatDate, getStatusColor } from "../../utils/formatCurrency";
import toast from "react-hot-toast";

const AdminCustomRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Quote & Status Form State
  const [quotedPrice, setQuotedPrice] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [status, setStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllCustomRequests();
      if (res && res.success) {
        setRequests(res.requests || res.data || []);
      }
    } catch (err) {
      console.error("Fetch custom requests error", err);
      toast.error("Failed to load custom requests");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return;
    setIsUpdating(true);
    try {
      const payload = {
        status: status || selectedRequest.status,
        quotedPrice: quotedPrice ? Number(quotedPrice) : selectedRequest.quotedPrice,
        adminNotes,
      };
      const res = await adminService.updateCustomRequestStatus(selectedRequest._id, payload);
      if (res && res.success) {
        toast.success("Custom request updated & quote saved! 🎨");
        fetchRequests();
        setSelectedRequest(null);
      }
    } catch (err) {
      toast.error("Failed to update custom request");
    } finally {
      setIsUpdating(false);
    }
  };

  const getWhatsAppLink = (req) => {
    const num = (req.whatsappNumber || req.customerPhone || "").replace(/[^0-9]/g, "");
    const cleanNum = num.startsWith("91") ? num : `91${num}`;
    const priceText = req.quotedPrice ? `Your price quote for the set is ₹${req.quotedPrice}.` : "";
    const msg = encodeURIComponent(
      `Hi ${req.customerName || "there"}! ❤️ We received your custom press-on nail request on PolishedByAnshika (${req.nailShape || "Custom"} shape, ${req.nailLength || "Custom"} length). ${priceText} Let us know if you'd like to proceed!`
    );
    return `https://wa.me/${cleanNum}?text=${msg}`;
  };

  const filteredRequests = requests.filter((r) => {
    const q = search.toLowerCase();
    return (
      !q ||
      r.customerName?.toLowerCase().includes(q) ||
      r.customerEmail?.toLowerCase().includes(q) ||
      r.whatsappNumber?.includes(q) ||
      r.nailShape?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-dark-800">Custom Instagram / Pinterest Orders</h1>
          <p className="text-dark-400 text-sm">Review customer photo references, quote price & dispatch custom nail orders via WhatsApp.</p>
        </div>
        <button onClick={fetchRequests} className="btn-secondary text-sm">
          Refresh Requests
        </button>
      </div>

      {/* Table Card */}
      <div className="glass-card p-6 border border-rose-100 space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" size={18} />
          <input
            type="text"
            placeholder="Search custom requests by customer name, email, or WhatsApp..."
            className="input-dark w-full pl-10 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="py-16 text-center text-dark-400">Loading custom requests...</div>
        ) : filteredRequests.length === 0 ? (
          <div className="py-16 text-center text-dark-300">
            <Sparkles size={36} className="mx-auto mb-2 opacity-40" />
            <p>No custom design requests found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-dark-400 border-b border-rose-100 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Nail Specs</th>
                  <th className="pb-3">Reference</th>
                  <th className="pb-3">Quoted Price</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRequests.map((req) => (
                  <tr key={req._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4">
                      <div className="font-bold text-dark-800">{req.customerName}</div>
                      <div className="text-xs text-dark-400">{req.customerEmail}</div>
                      <div className="text-xs text-emerald-400 font-mono mt-0.5">💬 {req.whatsappNumber || req.customerPhone}</div>
                    </td>
                    <td className="py-4">
                      <div className="flex flex-wrap gap-1">
                        <span className="text-[11px] bg-rose-50 text-rose-500 px-2 py-0.5 rounded border border-rose-500/20">
                          {req.nailShape || "Any"}
                        </span>
                        <span className="text-[11px] bg-rose-50 text-rose-500 px-2 py-0.5 rounded border border-rose-500/20">
                          {req.nailLength || "Any"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      {req.referenceImages && req.referenceImages.length > 0 ? (
                        <div className="flex gap-1">
                          {req.referenceImages.slice(0, 2).map((img, i) => (
                            <img key={i} src={img.url || img} alt="Ref" className="w-10 h-10 object-cover rounded-lg border border-rose-100" />
                          ))}
                          {req.referenceImages.length > 2 && (
                            <span className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-xs text-dark-400 font-bold">
                              +{req.referenceImages.length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-dark-300">Text description</span>
                      )}
                    </td>
                    <td className="py-4 font-bold text-gold-500">
                      {req.quotedPrice ? formatINR(req.quotedPrice) : <span className="text-xs text-dark-300 font-normal">Pending Quote</span>}
                    </td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-4 text-xs text-dark-400">{formatDate(req.createdAt)}</td>
                    <td className="py-4 text-right space-x-2">
                      <a
                        href={getWhatsAppLink(req)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-dark-800 transition-colors border border-emerald-500/20 text-xs font-medium inline-flex items-center gap-1"
                      >
                        <MessageCircle size={14} /> WhatsApp
                      </a>
                      <button
                        onClick={() => {
                          setSelectedRequest(req);
                          setStatus(req.status);
                          setQuotedPrice(req.quotedPrice || "");
                          setAdminNotes(req.adminNotes || "");
                        }}
                        className="btn-primary text-xs py-1.5 px-3 inline-flex items-center gap-1"
                      >
                        <Eye size={14} /> Details & Quote
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CUSTOM REQUEST DETAIL & QUOTE MODAL */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl glass-card border border-rose-100 p-6 md:p-8 rounded-3xl space-y-6 my-8 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-rose-100 pb-4">
              <div>
                <span className="text-xs text-rose-500 font-semibold uppercase tracking-wider">Custom Design Request</span>
                <h2 className="text-2xl font-bold font-display text-dark-800">{selectedRequest.customerName}</h2>
                <p className="text-xs text-dark-400">Received on {formatDate(selectedRequest.createdAt)}</p>
              </div>
              <button onClick={() => setSelectedRequest(null)} className="p-2 text-dark-400 hover:text-dark-800 rounded-full bg-white">
                <X size={20} />
              </button>
            </div>

            {/* Design Specs & Reference Images */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs bg-white/[0.03] p-4 rounded-2xl border border-rose-50">
                <div>
                  <span className="text-dark-400">Nail Shape:</span> <strong className="text-rose-500">{selectedRequest.nailShape || "Custom"}</strong>
                </div>
                <div>
                  <span className="text-dark-400">Nail Length:</span> <strong className="text-rose-500">{selectedRequest.nailLength || "Custom"}</strong>
                </div>
                <div>
                  <span className="text-dark-400">Occasion:</span> <strong className="text-dark-800">{selectedRequest.occasion || "Not specified"}</strong>
                </div>
                <div>
                  <span className="text-dark-400">Budget Range:</span> <strong className="text-gold-500">{selectedRequest.budgetRange || "Flexible"}</strong>
                </div>
              </div>

              {/* Custom Finger Sizes mm if present */}
              {selectedRequest.customSizeInMm && (
                <div className="text-xs bg-black/40 border border-amber-500/20 p-3 rounded-xl text-gold-400">
                  <strong>Custom Finger Sizes (mm):</strong> Thumb: {selectedRequest.customSizeInMm.thumb || "-"}mm | Index: {selectedRequest.customSizeInMm.index || "-"}mm | Middle: {selectedRequest.customSizeInMm.middle || "-"}mm | Ring: {selectedRequest.customSizeInMm.ring || "-"}mm | Pinky: {selectedRequest.customSizeInMm.pinky || "-"}mm
                </div>
              )}

              {/* Description */}
              {selectedRequest.description && (
                <div>
                  <h4 className="text-xs font-semibold text-dark-400 mb-1">Design Notes & Details:</h4>
                  <p className="text-xs text-dark-400 bg-white p-3 rounded-xl border border-rose-50 leading-relaxed">
                    {selectedRequest.description}
                  </p>
                </div>
              )}

              {/* Reference Images Gallery */}
              {selectedRequest.referenceImages && selectedRequest.referenceImages.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-dark-400 mb-2">Pinterest / Instagram Reference Photos:</h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedRequest.referenceImages.map((img, i) => (
                      <a key={i} href={img.url || img} target="_blank" rel="noopener noreferrer" className="group relative">
                        <img src={img.url || img} alt="Ref" className="w-24 h-24 object-cover rounded-xl border border-rose-100 group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-opacity text-dark-800 text-xs">
                          <ExternalLink size={16} />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Price Quote & Status Update Form */}
            <form onSubmit={handleUpdateSubmit} className="bg-rose-950/20 border border-rose-500/20 p-5 rounded-2xl space-y-4">
              <h4 className="text-sm font-bold text-dark-800 flex items-center gap-2">
                <Sparkles size={16} className="text-rose-500" /> Price Quote & Status
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-dark-400 mb-1">Final Quoted Price (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1199"
                    value={quotedPrice}
                    onChange={(e) => setQuotedPrice(e.target.value)}
                    className="input-dark w-full text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-dark-400 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="input-dark w-full text-sm bg-black/30"
                  >
                    <option value="Pending">Pending Review</option>
                    <option value="Reviewing">Reviewing Reference</option>
                    <option value="Quoted">Price Quoted</option>
                    <option value="Accepted">Accepted & Order Placed</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Completed">Completed & Dispatched</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-dark-400 mb-1">Admin Internal Notes</label>
                <textarea
                  rows={2}
                  placeholder="Notes about 3D charms needed, special prep required..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="input-dark w-full text-sm"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <a
                  href={getWhatsAppLink(selectedRequest)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-dark-800 text-xs font-bold transition-all shadow-lg flex items-center gap-2"
                >
                  <MessageCircle size={16} /> Send Quote on WhatsApp
                </a>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setSelectedRequest(null)} className="btn-ghost text-xs">
                    Cancel
                  </button>
                  <button type="submit" disabled={isUpdating} className="btn-primary text-xs px-5 py-2">
                    {isUpdating ? "Saving..." : "Save Quote"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomRequests;
