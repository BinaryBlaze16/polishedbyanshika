import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, Menu, X, LogOut, Package, Shield, MapPin, ChevronRight, UserPlus, LogIn } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';
import useWishlistStore from '../store/useWishlistStore';
import SizeGuideModal from './SizeGuideModal';
import logoImg from '../assets/logo.png';

import usePublicSettings from '../hooks/usePublicSettings';

const Navbar = () => {
  const { settings } = usePublicSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  
  const { user, token, logout } = useAuthStore();
  const isAuthenticated = Boolean(user && token);
  const itemCount = useCartStore(s => s.items.reduce((total, item) => total + (item.quantity || item.qty || 1), 0));
  const { items: wishlistItems } = useWishlistStore();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-md shadow-rose-900/5 py-3' 
          : 'bg-gradient-to-b from-[#FDF8F4] via-[#FDF8F4]/80 to-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2.5 group">
                <img 
                  src={logoImg} 
                  alt={settings.businessName} 
                  className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover border border-rose-500/20 shadow-sm group-hover:scale-105 transition-transform" 
                />
                <span className="font-display text-lg md:text-2xl font-bold bg-gradient-to-r from-rose-500 to-rose-600 bg-clip-text text-transparent tracking-tight">
                  {settings.businessName}
                </span>
              </Link>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-dark-700 hover:text-rose-500 font-medium text-sm transition-colors relative group">
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rose-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/shop" className="text-dark-700 hover:text-rose-500 font-medium text-sm transition-colors relative group">
                Shop
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rose-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/custom-order" className="text-dark-700 hover:text-rose-500 font-medium text-sm transition-colors relative group">
                Custom Order
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rose-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <button 
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-dark-700 hover:text-rose-500 font-medium text-sm transition-colors relative group"
              >
                Size Guide
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rose-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
            </div>

            {/* Desktop Right Action Icons & Auth */}
            <div className="hidden md:flex items-center space-x-5">
              
              {/* Search Trigger */}
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-dark-500 hover:text-rose-500 transition-colors rounded-full hover:bg-rose-50"
                title="Search"
              >
                <Search size={20} />
              </button>
              
              {/* Wishlist Icon */}
              <Link 
                to="/wishlist" 
                className="p-2 text-dark-500 hover:text-rose-500 transition-colors relative rounded-full hover:bg-rose-50"
                title="Wishlist"
              >
                <Heart size={20} />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full h-4.5 w-4.5 min-w-[18px] flex items-center justify-center shadow-xs">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart Icon */}
              <Link 
                to="/cart" 
                className="p-2 text-dark-500 hover:text-rose-500 transition-colors relative rounded-full hover:bg-rose-50"
                title="Shopping Cart"
              >
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full h-4.5 w-4.5 min-w-[18px] flex items-center justify-center shadow-xs">
                    {itemCount}
                  </span>
                )}
              </Link>

              <div className="h-6 w-px bg-rose-200/60 mx-1"></div>

              {/* Conditional Auth Rendering */}
              {isAuthenticated ? (
                /* Logged In User Avatar & Dropdown */
                <div className="relative" ref={userMenuRef}>
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-full border border-rose-200 bg-white hover:border-rose-400 transition-all shadow-xs"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-rose-400 text-white font-semibold text-sm flex items-center justify-center shadow-sm">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-3 w-56 rounded-2xl shadow-luxury bg-white border border-rose-100 py-2 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-rose-50 bg-rose-50/40">
                        <p className="text-xs font-bold text-dark-800 truncate">{user?.name}</p>
                        <p className="text-[11px] text-dark-400 truncate">{user?.email}</p>
                      </div>

                      <div className="py-1">
                        <Link 
                          to="/profile" 
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center px-4 py-2.5 text-xs font-medium text-dark-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        >
                          <User size={16} className="mr-3 text-rose-500" /> My Profile
                        </Link>

                        <Link 
                          to="/profile" 
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center px-4 py-2.5 text-xs font-medium text-dark-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        >
                          <Package size={16} className="mr-3 text-rose-500" /> My Orders
                        </Link>

                        <Link 
                          to="/wishlist" 
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center px-4 py-2.5 text-xs font-medium text-dark-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        >
                          <Heart size={16} className="mr-3 text-rose-500" /> Wishlist ({wishlistItems.length})
                        </Link>

                        <Link 
                          to="/profile" 
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center px-4 py-2.5 text-xs font-medium text-dark-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        >
                          <MapPin size={16} className="mr-3 text-rose-500" /> Saved Addresses
                        </Link>

                        {user?.role === 'admin' && (
                          <Link 
                            to="/admin" 
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center px-4 py-2.5 text-xs font-semibold text-rose-600 bg-rose-50/60 hover:bg-rose-100/80 transition-colors"
                          >
                            <Shield size={16} className="mr-3 text-rose-600" /> Admin Dashboard
                          </Link>
                        )}
                      </div>

                      <div className="pt-1 border-t border-rose-50">
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-2.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={16} className="mr-3" /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Logged Out: Display Sign In & Join Us Buttons */
                <div className="flex items-center space-x-3">
                  <Link 
                    to="/login" 
                    className="text-xs font-semibold text-dark-700 hover:text-rose-500 px-3.5 py-2 rounded-xl border border-rose-200 hover:border-rose-300 hover:bg-rose-50/50 transition-all"
                  >
                    Sign In
                  </Link>

                  <Link 
                    to="/register" 
                    className="text-xs font-semibold text-white bg-gradient-to-r from-rose-500 to-rose-400 hover:from-rose-600 hover:to-rose-500 px-4 py-2 rounded-xl transition-all shadow-glow-rose hover:scale-[1.02]"
                  >
                    Join Us
                  </Link>
                </div>
              )}

            </div>

            {/* Mobile Menu Icon Toggle */}
            <div className="md:hidden flex items-center space-x-3">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-dark-600 hover:text-rose-500 transition-colors"
              >
                <Search size={22} />
              </button>

              <Link to="/cart" className="p-2 text-dark-600 relative">
                <ShoppingCart size={22} />
                {itemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold rounded-full h-4.5 w-4.5 min-w-[18px] flex items-center justify-center shadow-xs">
                    {itemCount}
                  </span>
                )}
              </Link>

              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-dark-700 hover:text-rose-500 transition-colors"
              >
                {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Slide-over Drawer */}
        {isMobileMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <div className={`md:hidden fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-[#FDF8F4] z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-5 border-b border-rose-100 bg-white">
            <div className="flex items-center gap-2">
              <img src={logoImg} alt="Logo" className="h-8 w-8 rounded-full object-cover" />
              <span className="font-display font-bold text-dark-800 text-base">Polished by Anshika</span>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-dark-400 hover:text-dark-700 rounded-full hover:bg-rose-50"
            >
              <X size={20} />
            </button>
          </div>

          {/* Drawer Links */}
          <div className="flex-1 p-6 overflow-y-auto space-y-5">
            
            {/* User Info / Auth Banner inside Drawer */}
            {isAuthenticated ? (
              <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-sm mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-rose-400 text-white font-bold flex items-center justify-center">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-dark-800 text-sm">{user?.name}</p>
                    <p className="text-xs text-dark-400">{user?.email}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-sm mb-4 text-center">
                <p className="font-semibold text-dark-800 text-sm mb-1">Welcome to Polished By Anshika 💅</p>
                <p className="text-xs text-dark-400 mb-3">Sign in or create an account for fast checkout & saved orders</p>
                <div className="grid grid-cols-2 gap-2">
                  <Link 
                    to="/login" 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="py-2 px-3 text-xs font-semibold text-dark-800 border border-rose-200 rounded-xl hover:bg-rose-50 transition-colors flex items-center justify-center gap-1"
                  >
                    <LogIn size={14} /> Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="py-2 px-3 text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-colors shadow-glow-rose flex items-center justify-center gap-1"
                  >
                    <UserPlus size={14} /> Join Us
                  </Link>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between text-base font-semibold text-dark-800 hover:text-rose-500 py-1">
                Home <ChevronRight size={16} className="text-dark-300" />
              </Link>
              <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between text-base font-semibold text-dark-800 hover:text-rose-500 py-1">
                Shop Collection <ChevronRight size={16} className="text-dark-300" />
              </Link>
              <Link to="/custom-order" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between text-base font-semibold text-dark-800 hover:text-rose-500 py-1">
                Custom Order <ChevronRight size={16} className="text-dark-300" />
              </Link>
              <button 
                onClick={() => { setIsSizeGuideOpen(true); setIsMobileMenuOpen(false); }}
                className="w-full flex items-center justify-between text-base font-semibold text-dark-800 hover:text-rose-500 py-1 text-left"
              >
                Size Guide <ChevronRight size={16} className="text-dark-300" />
              </button>
              <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between text-base font-semibold text-dark-800 hover:text-rose-500 py-1">
                Wishlist
                <span className="bg-rose-100 text-rose-600 text-xs font-bold px-2.5 py-0.5 rounded-full">{wishlistItems.length}</span>
              </Link>
            </div>

            {isAuthenticated && (
              <>
                <div className="h-px bg-rose-200/60 my-4"></div>
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-dark-400">Account</p>
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-sm font-medium text-dark-700 hover:text-rose-500 py-1">
                    <User size={18} className="text-rose-500" /> My Profile
                  </Link>
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-sm font-medium text-dark-700 hover:text-rose-500 py-1">
                    <Package size={18} className="text-rose-500" /> My Orders
                  </Link>
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-sm font-medium text-dark-700 hover:text-rose-500 py-1">
                    <MapPin size={18} className="text-rose-500" /> Saved Addresses
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-sm font-semibold text-rose-600 py-1">
                      <Shield size={18} className="text-rose-600" /> Admin Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 text-sm font-medium text-red-500 py-2">
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      </nav>

      {/* Search Modal Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 backdrop-blur-sm pt-20 px-4 animate-in fade-in duration-150">
          <div className="bg-white border border-rose-100 w-full max-w-2xl rounded-3xl shadow-luxury p-4 md:p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold font-display text-dark-800 flex items-center gap-2">
                <Search size={20} className="text-rose-500" /> Search Press-On Nails
              </h3>
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="p-1.5 text-dark-400 hover:text-dark-800 rounded-full hover:bg-rose-50 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                type="text"
                autoFocus
                placeholder="Search designs e.g. French, Cateye, Glitter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-[#FDF8F4] border border-rose-200 rounded-2xl px-5 py-3.5 text-sm text-dark-800 focus:border-rose-500 focus:outline-none"
              />
              <button 
                type="submit"
                className="px-6 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-2xl text-sm transition-all shadow-glow-rose"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}

      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </>
  );
};

export default Navbar;
