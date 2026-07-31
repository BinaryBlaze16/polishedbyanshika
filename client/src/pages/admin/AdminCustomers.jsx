import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import { Search, Shield, UserX, UserCheck, Loader2, Users, Eye, MapPin, Package, ShoppingBag, X, Calendar, Phone, Mail, Trash2 } from "lucide-react";
import { formatDate, formatINR, getStatusColor } from "../../utils/formatCurrency";
import toast from "react-hot-toast";

const AdminCustomers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // User Detail Modal State
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetailData, setUserDetailData] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAllUsers({
        page,
        search,
        limit: 15,
      });
      if (res && res.success) {
        setUsers(res.data || []);
        setTotalPages(res.pages || 1);
        setTotalCount(res.total || 0);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load user accounts");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUserDetail = async (user) => {
    setSelectedUser(user);
    setLoadingDetails(true);
    try {
      const res = await adminService.getUserDetails(user._id);
      if (res && res.success) {
        setUserDetailData(res.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load customer profile details");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const actionText = user.isActive ? "Suspend" : "Activate";
    if (!window.confirm(`Are you sure you want to ${actionText.toLowerCase()} user "${user.name}"?`)) return;

    try {
      const res = await adminService.toggleUserStatus(user._id);
      if (res && res.success) {
        toast.success(`User account successfully ${user.isActive ? "suspended" : "activated"}`);
        fetchUsers();
        if (selectedUser && selectedUser._id === user._id) {
          setSelectedUser({ ...selectedUser, isActive: !selectedUser.isActive });
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to change user status`);
    }
  };

  const handleDeleteUser = async (user) => {
    if (user.role === 'admin') {
      return toast.error("Staff/Admin accounts cannot be deleted");
    }

    if (!window.confirm(`⚠️ PERMANENT DELETE WARNING:\n\nAre you sure you want to delete user "${user.name}" (${user.email})?\n\nDeleting this user will PERMANENTLY REMOVE:\n- Account profile\n- ALL their past orders & order history\n- ALL saved delivery addresses\n- Custom requests & reviews\n\nThis action CANNOT be undone!`)) return;

    try {
      const res = await adminService.deleteUser(user._id);
      if (res && res.success) {
        toast.success(`User "${user.name}" and all associated orders deleted! 🗑️`);
        if (selectedUser && selectedUser._id === user._id) {
          setSelectedUser(null);
        }
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete user account");
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-dark-800">Customer & Account Management</h1>
          <p className="text-dark-400 text-sm mt-1">
            View registered user profiles, inspect lifetime spending, suspend access, or delete user accounts & orders.
          </p>
        </div>
        <div className="bg-rose-50 border border-rose-200 text-rose-600 font-semibold px-4 py-2 rounded-xl text-sm flex items-center gap-2">
          <Users size={16} /> Total Registered: {totalCount}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glass-card p-6 border border-rose-100 space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" size={18} />
          <input
            type="text"
            placeholder="Search accounts by name or email address..."
            className="input-dark w-full pl-10 text-sm"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {loading && users.length === 0 ? (
          <div className="py-16 text-center text-dark-400 flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
            <span>Loading database records...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-dark-300">
            <Users size={40} className="mx-auto mb-2 opacity-30 text-rose-400" />
            <p>No user records match your search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-dark-400 border-b border-rose-100 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="pb-3">User Profile</th>
                  <th className="pb-3">Email Address</th>
                  <th className="pb-3">Phone</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Joined Date</th>
                  <th className="pb-3">Account Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-rose-500 to-rose-400 flex items-center justify-center text-white font-bold text-sm border border-rose-200 shadow-sm">
                          {getInitials(u.name)}
                        </div>
                        <div>
                          <div className="font-bold text-dark-800 tracking-tight flex items-center gap-1.5">
                            {u.name}
                            {u.role === "admin" && (
                              <span className="text-[9px] font-bold bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded uppercase">
                                Staff
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-dark-400 font-mono">ID: {u._id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 font-medium text-dark-600">{u.email}</td>
                    <td className="py-4 text-dark-400 font-mono text-xs">{u.phone || "—"}</td>
                    <td className="py-4 uppercase text-xs font-semibold">
                      <span className={u.role === "admin" ? "text-amber-600 font-bold" : "text-dark-600"}>{u.role}</span>
                    </td>
                    <td className="py-4 text-dark-400 text-xs">{formatDate(u.createdAt)}</td>
                    <td className="py-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                          u.isActive
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                            : "bg-rose-50 text-rose-600 border-rose-200"
                        }`}
                      >
                        {u.isActive ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenUserDetail(u)}
                        className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white transition-colors border border-rose-200 text-xs font-semibold inline-flex items-center gap-1"
                        title="View Full Customer Details & Order History"
                      >
                        <Eye size={14} /> Inspect
                      </button>
                      {u.role !== "admin" && (
                        <>
                          <button
                            onClick={() => handleToggleStatus(u)}
                            className={`p-1.5 rounded-lg border text-xs font-medium transition-all ${
                              u.isActive
                                ? "bg-amber-50 hover:bg-amber-500 hover:text-white border-amber-200 text-amber-600"
                                : "bg-emerald-50 hover:bg-emerald-600 hover:text-white border-emerald-200 text-emerald-600"
                            }`}
                            title={u.isActive ? "Suspend Account" : "Activate Account"}
                          >
                            {u.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u)}
                            className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all text-xs font-medium"
                            title="Delete Account & All Orders"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center pt-4 border-t border-rose-50">
            <span className="text-xs text-dark-400">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="btn-secondary text-xs disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className="btn-secondary text-xs disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CUSTOMER DETAIL MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl glass-card border border-rose-100 p-6 md:p-8 rounded-3xl space-y-6 my-8 animate-in fade-in bg-white">
            <div className="flex items-center justify-between border-b border-rose-100 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-rose-500 text-white font-bold text-lg flex items-center justify-center shadow-glow-rose">
                  {getInitials(selectedUser.name)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-display text-dark-800">{selectedUser.name}</h2>
                  <p className="text-xs text-dark-400">Member since {formatDate(selectedUser.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedUser.role !== 'admin' && (
                  <button
                    onClick={() => handleDeleteUser(selectedUser)}
                    className="px-3 py-1.5 rounded-xl bg-rose-500 text-white hover:bg-rose-600 transition-colors text-xs font-bold flex items-center gap-1.5 shadow-glow-rose"
                  >
                    <Trash2 size={14} /> Delete Account & Orders
                  </button>
                )}
                <button onClick={() => setSelectedUser(null)} className="p-2 text-dark-400 hover:text-dark-800 rounded-full bg-rose-50">
                  <X size={20} />
                </button>
              </div>
            </div>

            {loadingDetails ? (
              <div className="py-16 text-center text-dark-400 flex justify-center"><Loader2 className="animate-spin text-rose-500" size={32} /></div>
            ) : (
              <div className="space-y-6">
                {/* Stats Summary Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-rose-50/60 border border-rose-100 p-4 rounded-2xl">
                    <p className="text-xs text-dark-400 font-semibold uppercase">Total Orders</p>
                    <p className="text-2xl font-bold text-dark-800 mt-1">{userDetailData?.totalOrders || 0}</p>
                  </div>
                  <div className="bg-emerald-50/60 border border-emerald-100 p-4 rounded-2xl">
                    <p className="text-xs text-dark-400 font-semibold uppercase">Lifetime Spend</p>
                    <p className="text-2xl font-bold text-emerald-600 mt-1">{formatINR(userDetailData?.lifetimeSpend || 0)}</p>
                  </div>
                  <div className="bg-purple-50/60 border border-purple-100 p-4 rounded-2xl col-span-2 sm:col-span-1">
                    <p className="text-xs text-dark-400 font-semibold uppercase">Saved Addresses</p>
                    <p className="text-2xl font-bold text-purple-600 mt-1">{userDetailData?.addresses?.length || 0}</p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-[#FDF8F4] border border-rose-100 p-4 rounded-2xl space-y-2 text-sm">
                  <h4 className="text-xs font-bold uppercase text-rose-500 tracking-wider">Contact & Account Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-dark-600">
                    <p className="flex items-center gap-2"><Mail size={14} className="text-rose-400" /> {selectedUser.email}</p>
                    <p className="flex items-center gap-2"><Phone size={14} className="text-rose-400" /> {selectedUser.phone || "No phone provided"}</p>
                  </div>
                </div>

                {/* Saved Addresses Section */}
                <div>
                  <h4 className="text-xs font-bold uppercase text-rose-500 tracking-wider mb-3 flex items-center gap-1.5">
                    <MapPin size={14} /> Saved Delivery Addresses ({userDetailData?.addresses?.length || 0})
                  </h4>
                  {userDetailData?.addresses?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {userDetailData.addresses.map((addr, i) => (
                        <div key={i} className="bg-white border border-rose-100 p-3.5 rounded-2xl text-xs space-y-1">
                          <span className="font-bold text-dark-800">{addr.fullName}</span> ({addr.addressType || "Address"})
                          <p className="text-dark-400">{addr.houseNumber}, {addr.street}</p>
                          <p className="text-dark-400">{addr.city}, {addr.state} - {addr.pincode}</p>
                          <p className="text-dark-400">📞 {addr.phone}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-dark-400 italic">No saved addresses on profile yet.</p>
                  )}
                </div>

                {/* Order History Section */}
                <div>
                  <h4 className="text-xs font-bold uppercase text-rose-500 tracking-wider mb-3 flex items-center gap-1.5">
                    <ShoppingBag size={14} /> Customer Order History ({userDetailData?.orders?.length || 0})
                  </h4>
                  {userDetailData?.orders?.length > 0 ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {userDetailData.orders.map((ord) => (
                        <div key={ord._id} className="flex items-center justify-between p-3.5 bg-white border border-rose-100 rounded-2xl text-xs">
                          <div>
                            <span className="font-mono font-bold text-rose-500">{ord.orderNumber}</span>
                            <span className="text-dark-400 ml-2">• {formatDate(ord.createdAt)}</span>
                            <p className="text-dark-400 mt-0.5">{ord.orderItems?.length || 0} items • {formatINR(ord.totalPrice)}</p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getStatusColor(ord.orderStatus)}`}>
                            {ord.orderStatus}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-dark-400 italic">No orders placed yet by this customer.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
