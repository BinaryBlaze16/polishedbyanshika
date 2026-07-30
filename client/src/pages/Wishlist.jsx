import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import useWishlistStore from '../store/useWishlistStore';

export default function Wishlist() {
  const { items, clearWishlist, removeItem } = useWishlistStore();

  return (
    <div className="min-h-screen bg-[#FDF8F4] text-[#3D2B1F] font-sans flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-6 pt-24 md:pt-28 pb-12">
        <div className="flex justify-between items-end mb-10 border-b border-rose-100 pb-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-dark-800 mb-2">My Wishlist</h1>
            <p className="text-dark-400">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
          </div>
          {items.length > 0 && (
            <button onClick={clearWishlist} className="text-sm text-dark-400 hover:text-rose-500 transition-colors">
              Clear All
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-rose-100 max-w-2xl mx-auto">
            <Heart size={64} className="mx-auto text-dark-300 mb-6" />
            <h2 className="text-2xl font-display font-bold text-dark-800 mb-4">Your wishlist is empty</h2>
            <p className="text-dark-400 mb-8">Save your favorite nail sets here to find them easily later.</p>
            <Link to="/shop" className="inline-block px-8 py-3 bg-rose-500 hover:bg-rose-600 text-dark-800 rounded-full font-medium transition-all">
              Discover Designs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {items.map(product => {
              const pid = product._id || product.id;
              return (
                <div key={pid} className="relative group">
                  <ProductCard product={product} />
                  <button
                    onClick={() => removeItem(pid)}
                    className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-white/90 border border-rose-200 text-rose-400 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm opacity-0 group-hover:opacity-100"
                    title="Remove from wishlist"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
