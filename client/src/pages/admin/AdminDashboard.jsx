import React, { useEffect, useState } from "react";
import { 
  TrendingUp, ShoppingBag, Clock, Package, Users, Plus, ArrowRight, 
  CheckCircle2, Sparkles, DollarSign, Calendar, AlertTriangle, XCircle, 
  Truck, Star, Layers, ShieldCheck, Box, RefreshCw
} from "lucide-react";
import adminService from "../../services/adminService";
import { formatINR, formatDate, getStatusColor } from "../../utils/formatCurrency";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    todayRevenue: 0,
    monthlyRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    outForDeliveryOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    activeProducts: 0,
    outOfStockProducts: 0,
    lowStockProducts: 0,
    totalReviews: 0,
    avgRating: 0,
    recentOrders: [],
    revenueByMonth: [],
    dailyOrders: [],
    orderStatusDistribution: [],
    topProducts: []
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await adminService.getDashboardStats();
      if (res && res.success) {
        setStats(res.data || res);
      }
    } catch (err) {
      console.error("Dashboard stats fetch error", err);
      toast.error("Failed to load real-time analytics");
    } finally {
      setLoading(false);
    }
  };

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Find max revenue for bar chart scaling
  const maxRevenue = Math.max(...(stats.revenueByMonth?.map(m => m.revenue) || [1000]), 1000);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-950/40 via-[#1a1b2e] to-purple-950/40 border border-rose-500/20 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-50 rounded-full blur-[100px] pointer-events-none"></div>
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-500/20 text-rose-500 text-xs font-semibold mb-3">
            <Sparkles size={14} /> Live MongoDB Real-Time Analytics
          </div>
          <h1 className="text-3xl font-display font-bold text-dark-800">Studio Executive Dashboard</h1>
          <p className="text-dark-400 text-sm mt-1">Real-time studio sales, inventory levels, order tracking & customer insights.</p>
        </div>
        <div className="flex flex-wrap gap-3 z-10">
          <button onClick={fetchStats} className="btn-secondary flex items-center gap-2 text-sm">
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh DB Data
          </button>
          <Link to="/admin/products" className="btn-primary flex items-center gap-2 text-sm shadow-glow-rose">
            <Plus size={16} /> Add Product
          </Link>
        </div>
      </div>

      {/* Section 1: Financial & Core Metrics (3 Cards) */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-rose-500 mb-4 flex items-center gap-2">
          <DollarSign size={16} /> Financial Overview (Live Database)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <KpiCard
            title="Total Revenue (All Time)"
            value={formatINR(stats.totalRevenue)}
            subText="Paid & delivered orders"
            icon={TrendingUp}
            color="text-emerald-500"
            bgColor="bg-emerald-500/10 border-emerald-500/20"
          />
          <KpiCard
            title="Today's Revenue"
            value={formatINR(stats.todayRevenue)}
            subText="Earnings generated today"
            icon={DollarSign}
            color="text-rose-500"
            bgColor="bg-rose-500/10 border-rose-500/20"
          />
          <KpiCard
            title="This Month's Revenue"
            value={formatINR(stats.monthlyRevenue)}
            subText="Earnings current month"
            icon={Calendar}
            color="text-purple-500"
            bgColor="bg-purple-500/10 border-purple-500/20"
          />
        </div>
      </div>

      {/* Section 2: Order Fulfillment Pipeline (7 Cards) */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-rose-500 mb-4 flex items-center gap-2">
          <ShoppingBag size={16} /> Order Fulfillment Status
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          <MiniKpiCard title="Total Orders" value={stats.totalOrders} icon={ShoppingBag} color="text-dark-800" />
          <MiniKpiCard title="Pending" value={stats.pendingOrders} icon={Clock} color="text-amber-500" />
          <MiniKpiCard title="Preparing" value={stats.processingOrders} icon={Box} color="text-blue-500" />
          <MiniKpiCard title="Shipped" value={stats.shippedOrders} icon={Truck} color="text-indigo-500" />
          <MiniKpiCard title="Out for Delivery" value={stats.outForDeliveryOrders} icon={Truck} color="text-purple-500" />
          <MiniKpiCard title="Delivered" value={stats.deliveredOrders} icon={CheckCircle2} color="text-emerald-500" />
          <MiniKpiCard title="Cancelled" value={stats.cancelledOrders} icon={XCircle} color="text-rose-500" />
        </div>
      </div>

      {/* Section 3: Product Inventory & Customer Rating Metrics (5 Cards) */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-rose-500 mb-4 flex items-center gap-2">
          <Package size={16} /> Catalog, Inventory & Ratings
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <KpiCard
            title="Total Catalog Products"
            value={stats.totalProducts}
            subText={`${stats.activeProducts} active live items`}
            icon={Package}
            color="text-indigo-500"
            bgColor="bg-indigo-500/10 border-indigo-500/20"
          />
          <KpiCard
            title="Low Stock Alert"
            value={stats.lowStockProducts}
            subText="Stock ≤ 5 units remaining"
            icon={AlertTriangle}
            color="text-amber-500"
            bgColor="bg-amber-500/10 border-amber-500/20"
          />
          <KpiCard
            title="Out of Stock"
            value={stats.outOfStockProducts}
            subText="Stock = 0 units"
            icon={XCircle}
            color="text-rose-500"
            bgColor="bg-rose-500/10 border-rose-500/20"
          />
          <KpiCard
            title="Total Customers"
            value={stats.totalCustomers}
            subText="Registered account users"
            icon={Users}
            color="text-cyan-500"
            bgColor="bg-cyan-500/10 border-cyan-500/20"
          />
          <KpiCard
            title="Customer Reviews"
            value={`${stats.avgRating} ⭐`}
            subText={`Based on ${stats.totalReviews} reviews`}
            icon={Star}
            color="text-amber-400"
            bgColor="bg-amber-400/10 border-amber-400/20"
          />
        </div>
      </div>

      {/* Grid: Real Revenue Analytics & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Monthly Revenue Chart */}
        <div className="lg:col-span-2 glass-card p-6 border border-rose-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-dark-800">Real Monthly Revenue Trend</h3>
                <p className="text-xs text-dark-400">Monthly revenue calculated from completed/paid orders in MongoDB</p>
              </div>
              <span className="text-xs text-rose-500 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 font-semibold">
                MongoDB Aggregation
              </span>
            </div>
          </div>

          {stats.revenueByMonth && stats.revenueByMonth.length > 0 ? (
            <div className="h-56 flex items-end justify-between gap-4 pt-8 border-t border-rose-50">
              {stats.revenueByMonth.map((m, i) => {
                const mLabel = `${monthNames[(m._id.month - 1) % 12]} ${m._id.year}`;
                const heightPercent = Math.max(Math.round((m.revenue / maxRevenue) * 100), 10);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div
                      className="w-full bg-gradient-to-t from-rose-500 to-rose-400 group-hover:from-rose-600 group-hover:to-rose-500 transition-all duration-300 rounded-t-xl relative flex items-end justify-center shadow-sm"
                      style={{ height: `${heightPercent}%` }}
                    >
                      <span className="absolute -top-8 text-[11px] font-bold text-dark-800 bg-white px-2 py-0.5 rounded shadow-sm border border-rose-200 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {formatINR(m.revenue)} ({m.orders} orders)
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-dark-400 truncate max-w-full">{mLabel}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-56 flex items-center justify-center text-dark-400 text-sm border-t border-rose-50">
              No monthly sales data recorded yet. Place orders to see live revenue trend bars!
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="glass-card p-6 border border-rose-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-dark-800">Top Best-Sellers</h3>
            <Link to="/admin/products" className="text-xs text-rose-500 hover:text-rose-600 font-semibold">
              Catalog →
            </Link>
          </div>
          <p className="text-xs text-dark-400 mb-4">Ranked by total quantity ordered</p>

          {stats.topProducts && stats.topProducts.length > 0 ? (
            <div className="space-y-4">
              {stats.topProducts.map((p, idx) => (
                <div key={p._id || idx} className="flex items-center justify-between p-3 rounded-2xl bg-white border border-rose-50 hover:border-rose-200 transition-all">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 text-xs font-bold flex items-center justify-center border border-rose-200">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-dark-800 truncate max-w-[140px]">{p.name}</p>
                      <p className="text-[10px] text-dark-400">{p.totalSold} sets sold</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">{formatINR(p.revenue || (p.price * p.totalSold))}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-dark-400 text-sm">
              No sales recorded yet for ranking top products.
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="glass-card p-6 border border-rose-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-dark-800">Recent Customer Orders</h3>
            <p className="text-xs text-dark-400">Live order activity from the database</p>
          </div>
          <Link to="/admin/orders" className="text-xs text-rose-500 hover:text-rose-600 font-semibold flex items-center gap-1">
            Manage All Orders <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-dark-400">Loading database orders...</div>
        ) : stats.recentOrders.length === 0 ? (
          <div className="py-12 text-center text-dark-300">
            <ShoppingBag size={40} className="mx-auto mb-2 opacity-30 text-rose-400" />
            <p className="text-sm font-semibold text-dark-800">No orders placed yet</p>
            <p className="text-xs text-dark-400 mt-1">New customer orders will appear here automatically.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-dark-400 border-b border-rose-100 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="pb-3">Order #</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Total Amount</th>
                  <th className="pb-3">Order Status</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50">
                {stats.recentOrders.map((o) => (
                  <tr key={o._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 font-mono text-rose-500 font-bold">{o.orderNumber}</td>
                    <td className="py-3 font-semibold text-dark-800">{o.shippingAddress?.fullName || o.user?.name || "Customer"}</td>
                    <td className="py-3 text-emerald-600 font-bold">{formatINR(o.totalPrice)}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(o.orderStatus)}`}>
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 text-dark-400 text-xs">{formatDate(o.createdAt)}</td>
                    <td className="py-3 text-right">
                      <Link to="/admin/orders" className="text-xs px-3 py-1 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 font-semibold hover:bg-rose-500 hover:text-white transition-colors">
                        Manage
                      </Link>
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

const KpiCard = ({ title, value, subText, icon: Icon, color, bgColor }) => (
  <div className="glass-card p-6 border border-rose-100 hover:border-rose-300 transition-all duration-300 flex items-center justify-between">
    <div>
      <p className="text-xs text-dark-400 font-semibold uppercase tracking-wider mb-1">{title}</p>
      <h3 className={`text-2xl font-bold font-display tracking-tight ${color}`}>{value}</h3>
      <p className="text-[11px] text-dark-400 mt-1">{subText}</p>
    </div>
    <div className={`p-3.5 rounded-2xl border ${bgColor} ${color}`}>
      <Icon size={24} />
    </div>
  </div>
);

const MiniKpiCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white border border-rose-100 p-4 rounded-2xl text-center hover:border-rose-200 transition-all">
    <Icon size={18} className={`mx-auto mb-1 ${color}`} />
    <h4 className="text-lg font-bold text-dark-800">{value}</h4>
    <p className="text-[11px] text-dark-400 truncate">{title}</p>
  </div>
);

export default AdminDashboard;
