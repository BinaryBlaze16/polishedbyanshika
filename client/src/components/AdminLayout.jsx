import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, Users, Sparkles, Tag, Image as ImageIcon, Settings, LogOut, Menu, X, Star } from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import logoImg from '../assets/logo.png';

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Products", path: "/admin/products", icon: Package },
    { name: "Orders", path: "/admin/orders", icon: ShoppingBag },
    { name: "Customers", path: "/admin/customers", icon: Users },
    { name: "Custom Requests", path: "/admin/custom-requests", icon: Sparkles },
    { name: "Reviews", path: "/admin/reviews", icon: Star },
    { name: "Coupons", path: "/admin/coupons", icon: Tag },
    { name: "Banners", path: "/admin/banners", icon: ImageIcon },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-[#FDF8F4] text-[#3D2B1F] font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-md border-r border-rose-100 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-20 px-6 border-b border-rose-100">
          <Link to="/admin" className="flex items-center gap-2">
            <img src={logoImg} alt="Logo" className="h-10 w-10 rounded-full object-cover border border-rose-200" />
            <span className="text-lg font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-gold-500">
              Admin
            </span>
          </Link>
          <button className="lg:hidden text-dark-400 hover:text-dark-700" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-5rem)]">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== "/admin" && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-rose-500/10 to-gold-500/5 text-rose-500 border border-rose-200 shadow-sm"
                    : "text-dark-400 hover:text-dark-700 hover:bg-rose-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon size={20} className={isActive ? "text-rose-500" : "text-dark-400"} />
                <span className="font-medium tracking-wide">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-rose-100 flex items-center justify-between px-6 z-30">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-dark-400 hover:text-dark-700" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-medium tracking-wide text-dark-800 hidden sm:block">
              {navItems.find((item) => item.path === location.pathname)?.name || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-sm text-dark-400 hidden sm:block">
              Welcome, <span className="text-rose-500 font-medium">{user?.name || "Admin"}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 custom-scrollbar relative">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-500/3 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold-500/3 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="relative z-10 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
