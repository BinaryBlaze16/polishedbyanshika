import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import productService from '../services/productService';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filters State
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [shape, setShape] = useState(searchParams.get('shape') || 'all');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  
  const shapes = ['Almond', 'Coffin', 'Square', 'Stiletto', 'Oval'];
  const categories = ['All', 'Solid Colors', 'French Tips', '3D Art', 'Y2K', 'Wedding'];

  useEffect(() => {
    fetchProducts();
  }, [category, shape, sort]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productService.getProducts({ category, shape, sort });
      const itemsList = Array.isArray(res) ? res : (res?.data || res?.products || []);
      setProducts(Array.isArray(itemsList) ? itemsList : []);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'all' || !value) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
    if(key === 'category') setCategory(value);
    if(key === 'shape') setShape(value);
    if(key === 'sort') setSort(value);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
    setCategory('all');
    setShape('all');
    setSort('newest');
  };

  const FilterSidebar = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-display font-bold text-dark-800">Filters</h3>
        <button onClick={clearFilters} className="text-sm text-rose-500 hover:text-rose-600">Clear All</button>
      </div>
      
      {/* Categories */}
      <div>
        <h4 className="font-semibold text-dark-500 mb-4">Category</h4>
        <div className="space-y-3">
          {categories.map((c) => {
            const val = c.toLowerCase();
            return (
              <label key={c} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="category" 
                  value={val} 
                  checked={category === val}
                  onChange={(e) => updateFilters('category', e.target.value)}
                  className="appearance-none w-4 h-4 rounded-full border border-rose-300 checked:border-rose-500 checked:bg-rose-500 bg-transparent transition-all group-hover:border-rose-400"
                />
                <span className={`text-sm ${category === val ? 'text-dark-800 font-medium' : 'text-dark-400 group-hover:text-dark-600'}`}>{c}</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Shapes */}
      <div>
        <h4 className="font-semibold text-dark-500 mb-4">Shape</h4>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="radio" 
              name="shape" 
              value="all" 
              checked={shape === 'all'}
              onChange={(e) => updateFilters('shape', e.target.value)}
              className="appearance-none w-4 h-4 rounded-full border border-rose-300 checked:border-rose-500 checked:bg-rose-500 bg-transparent"
            />
            <span className={`text-sm ${shape === 'all' ? 'text-dark-800 font-medium' : 'text-dark-400'}`}>All Shapes</span>
          </label>
          {shapes.map((s) => {
            const val = s.toLowerCase();
            return (
              <label key={s} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="shape" 
                  value={val} 
                  checked={shape === val}
                  onChange={(e) => updateFilters('shape', e.target.value)}
                  className="appearance-none w-4 h-4 rounded-full border border-rose-300 checked:border-rose-500 checked:bg-rose-500 bg-transparent transition-all group-hover:border-rose-400"
                />
                <span className={`text-sm ${shape === val ? 'text-dark-800 font-medium' : 'text-dark-400 group-hover:text-dark-600'}`}>{s}</span>
              </label>
            )
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDF8F4] text-[#3D2B1F] font-sans">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white/50 border-b border-rose-100 py-12 pt-32">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-dark-800">Our Collection</h1>
          <p className="text-dark-400">Discover hand-painted luxury press-on nails for every occasion.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 shrink-0 pr-8 border-r border-rose-100">
            <FilterSidebar />
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between mb-4">
            <button onClick={() => setIsMobileFilterOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-rose-100 text-dark-500 shadow-soft">
              <Filter size={18} /> Filters
            </button>
            <span className="text-sm text-dark-400">{products.length} Results</span>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Top Bar */}
            <div className="hidden lg:flex items-center justify-between mb-8 pb-4 border-b border-rose-100">
              <span className="text-dark-400">{products.length} Results</span>
              <div className="flex items-center gap-4">
                <span className="text-sm text-dark-400">Sort by:</span>
                <select 
                  value={sort}
                  onChange={(e) => updateFilters('sort', e.target.value)}
                  className="bg-white border border-rose-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-rose-500 text-dark-700"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {products.map((p) => <ProductCard key={p._id || p.id} product={p} />)}
              </div>
            ) : (
              <div className="text-center py-24">
                <p className="text-xl text-dark-400 mb-4">No products found matching your criteria.</p>
                <button onClick={clearFilters} className="text-rose-500 hover:text-rose-600 underline underline-offset-4">Clear all filters</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)}></div>
          <div className="relative w-[80%] max-w-sm bg-[#FDF8F4] h-full p-6 overflow-y-auto shadow-luxury animate-in slide-in-from-left">
            <button onClick={() => setIsMobileFilterOpen(false)} className="absolute top-6 right-6 text-dark-400 hover:text-dark-700">
              <X size={24} />
            </button>
            <FilterSidebar />
            <div className="mt-8 pt-8 border-t border-rose-100">
              <div className="space-y-4">
                <h4 className="font-semibold text-dark-500">Sort By</h4>
                <select 
                  value={sort}
                  onChange={(e) => updateFilters('sort', e.target.value)}
                  className="w-full bg-white border border-rose-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-rose-500 text-dark-700"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
              <button onClick={() => setIsMobileFilterOpen(false)} className="w-full mt-8 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-medium transition-colors">Apply & Close</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
