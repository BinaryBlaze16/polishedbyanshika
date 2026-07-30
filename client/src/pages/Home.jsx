import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Check, Star, ArrowRight, Ruler, Droplets, Clock, Heart } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import SizeGuideModal from '../components/SizeGuideModal';
import productService from '../services/productService';
import logoImg from '../assets/logo.png';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);

  useEffect(() => {
    // Mock fetch or actual API
    const fetchData = async () => {
      try {
        const prods = await productService.getFeaturedProducts();
        const prodList = Array.isArray(prods) ? prods : (prods?.data || prods?.products || []);
        setFeaturedProducts(Array.isArray(prodList) ? prodList : []);
        
        const cats = await productService.getCategories();
        const catList = Array.isArray(cats) ? cats : (cats?.data || cats?.categories || []);
        setCategories(Array.isArray(catList) ? catList : []);
      } catch (err) {
        console.error("Error fetching home data:", err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDF8F4] text-[#3D2B1F] font-sans selection:bg-rose-500/20">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-400/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-rose-300/5 rounded-full blur-[100px] animate-pulse delay-500"></div>
        </div>
        
        <div className="container mx-auto px-6 z-10 flex flex-col lg:flex-row items-center gap-12 pt-20">
          <div className="flex-1 text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 bg-rose-500/10 text-rose-500 px-4 py-2 rounded-full text-sm font-medium border border-rose-500/20">
              <Sparkles size={16} />
              Premium Handcrafted Press-On Nails
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight text-dark-800">
              Wear Art. <br />
              Live <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-gold-500">Beautiful.</span>
            </h1>
            <p className="text-lg md:text-xl text-dark-400 max-w-xl mx-auto lg:mx-0">
              Handcrafted, luxury press-on nails that look and feel like a professional salon manicure. Applied in minutes, lasts for weeks.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link to="/shop" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-rose-500 to-rose-400 hover:from-rose-600 hover:to-rose-500 text-white rounded-full font-medium transition-all shadow-glow-rose hover:shadow-lg">
                Explore Collection
              </Link>
              <Link to="/custom-order" className="w-full sm:w-auto px-8 py-4 bg-transparent border border-rose-500/30 hover:bg-rose-500/5 text-rose-500 rounded-full font-medium transition-all">
                Custom Order
              </Link>
            </div>
          </div>
          
          {/* Right Side — Logo Showcase */}
          <div className="flex-1 hidden lg:flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/5 to-transparent rounded-full blur-3xl -z-10"></div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-rose-500/20 to-gold-500/20 rounded-full blur-2xl animate-pulse"></div>
              <img 
                src={logoImg} 
                alt="Polished by Anshika" 
                className="relative w-80 h-80 xl:w-96 xl:h-96 rounded-full object-cover border-4 border-white shadow-luxury"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="py-12 border-y border-rose-500/10 bg-white/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Sparkles, title: 'Free Prep Kit', desc: 'Included with every order' },
              { icon: Droplets, title: 'Ultra-Light Wear', desc: 'Feels like natural nails' },
              { icon: Clock, title: 'Lasts 2-3 Weeks', desc: 'Durable & reusable' },
              { icon: Heart, title: '100% Handcrafted', desc: 'Made with love & care' }
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-rose-100 hover:border-rose-200 hover:shadow-card transition-all">
                <div className="p-3 bg-rose-50 rounded-xl text-rose-500">
                  <feature.icon size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-dark-800">{feature.title}</h4>
                  <p className="text-sm text-dark-400">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-dark-800">Trending Now</h2>
            <p className="text-dark-400">Discover our most loved nail sets this week.</p>
          </div>
          <Link to="/shop" className="hidden sm:flex items-center gap-2 text-rose-500 hover:text-rose-600 transition-colors group">
            View All <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loadingProducts
            ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : (Array.isArray(featuredProducts) ? featuredProducts : []).map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))
          }
        </div>
      </section>

      {/* Size Guide CTA */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#3D2B1F] to-[#522B32] border border-rose-500/20 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-luxury">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px]"></div>
            <div className="relative z-10 flex items-center gap-6">
              <div className="p-4 bg-rose-500/20 rounded-full text-rose-300 hidden sm:block">
                <Ruler size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold mb-2 text-white">Not sure about your size?</h3>
                <p className="text-linen-400 max-w-md">Use our simple size guide to find your perfect fit and ensure your nails look flawless and natural.</p>
              </div>
            </div>
            <button onClick={() => setIsSizeModalOpen(true)} className="relative z-10 whitespace-nowrap px-8 py-4 bg-white text-dark-800 font-semibold rounded-full hover:bg-linen-100 transition-colors shadow-lg">
              View Size Guide
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-dark-800">Flawless Nails in 4 Steps</h2>
            <p className="text-dark-400">Your journey to a perfect manicure at home.</p>
          </div>
          
          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-rose-500/30 to-transparent -translate-y-1/2 z-0"></div>
            {[
              { num: '01', title: 'Measure', desc: 'Find your perfect size using our guide' },
              { num: '02', title: 'Choose', desc: 'Pick your favorite design & shape' },
              { num: '03', title: 'Prep', desc: 'Use included kit for a clean base' },
              { num: '04', title: 'Apply', desc: 'Press on and slay all day' }
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-white border-2 border-rose-200 flex items-center justify-center text-xl font-display font-bold text-rose-500 mb-6 group-hover:scale-110 group-hover:bg-rose-500 group-hover:text-white group-hover:border-rose-500 transition-all shadow-card">
                  {step.num}
                </div>
                <h4 className="text-xl font-bold mb-2 text-dark-800">{step.title}</h4>
                <p className="text-dark-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-12 text-center text-dark-800">Loved by Queens</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Sarah J.', text: 'Honestly the best press-ons I\'ve ever used. They look exactly like acrylics and lasted me almost 3 weeks!' },
            { name: 'Priya M.', text: 'The custom sizing is a game changer. No more filing down edges. The art is so precise and beautiful.' },
            { name: 'Elena R.', text: 'I wore the Glazed Donut set for my wedding and got so many compliments. Highly recommend Polished By Anshika!' }
          ].map((review, i) => (
            <div key={i} className="p-8 rounded-3xl bg-white border border-rose-100 shadow-card hover:shadow-card-hover transition-all relative">
              <div className="flex gap-1 text-gold-500 mb-6">
                {[...Array(5)].map((_, j) => <Star key={j} size={18} fill="currentColor" />)}
              </div>
              <p className="text-dark-500 italic mb-6 leading-relaxed">"{review.text}"</p>
              <div className="font-semibold text-rose-500">- {review.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 border-t border-rose-100 text-center bg-gradient-to-b from-transparent to-rose-50/50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-dark-800">Ready for your new look?</h2>
          <p className="text-xl text-dark-400 mb-10 max-w-2xl mx-auto">Follow us on Instagram for daily nail inspo or message us on WhatsApp for quick support.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a href="https://instagram.com/polished_by_anshika" target="_blank" rel="noreferrer" className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white rounded-full font-medium transition-all shadow-lg">
              Follow on Instagram
            </a>
            <a href="https://wa.me/916394802184" target="_blank" rel="noreferrer" className="px-8 py-4 bg-[#25D366] hover:bg-[#20b958] text-white rounded-full font-medium transition-all shadow-lg">
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <SizeGuideModal isOpen={isSizeModalOpen} onClose={() => setIsSizeModalOpen(false)} />
    </div>
  );
}
