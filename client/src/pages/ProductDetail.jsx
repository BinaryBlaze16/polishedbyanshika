import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Ruler, Minus, Plus, ShoppingBag, Truck, RotateCcw, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StarRating from '../components/StarRating';
import SizeGuideModal from '../components/SizeGuideModal';
import useCartStore from '../store/useCartStore';
import useWishlistStore from '../store/useWishlistStore';
import productService from '../services/productService';
import { formatINR } from '../utils/formatCurrency';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Selections
  const [activeImage, setActiveImage] = useState('');
  const [selectedShape, setSelectedShape] = useState('');
  const [selectedLength, setSelectedLength] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty] = useState(1);
  const [customSizes, setCustomSizes] = useState({ thumb: '', index: '', middle: '', ring: '', pinky: '' });
  
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const addToCart = useCartStore(s => s.addItem);
  const { items: wishlistItems, toggleWishlist } = useWishlistStore();

  useEffect(() => {
    // mock fetch
    productService.getProductBySlug(slug).then(data => {
      setProduct(data);
      if(data) {
        setActiveImage(data.images[0]?.url || data.images[0] || '');
        setSelectedShape(data.shapes?.[0]);
        setSelectedLength(data.lengths?.[0]);
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-[#FDF8F4] flex items-center justify-center"><div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!product) return <div className="min-h-screen bg-[#FDF8F4] text-dark-800 flex items-center justify-center">Product not found</div>;

  const productId = product?._id || product?.id;
  const isWishlisted = wishlistItems.some(item => (item._id || item.id) === productId);

  const handleWishlistToggle = () => {
    toggleWishlist(product);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist! 💕');
  };

  const handleAddToCart = () => {
    if(!selectedSize) return toast.error('Please select a size');
    
    addToCart({
      id: `${product._id || product.id}-${selectedShape}-${selectedLength}-${selectedSize}`,
      product,
      quantity: qty,
      shape: selectedShape,
      length: selectedLength,
      size: selectedSize,
      customSizes: null
    });
    toast.success('Added to cart!');
  };

  const handleBuyNow = () => {
    if(!selectedSize) return toast.error('Please select a size');
    
    addToCart({
      id: `${product._id || product.id}-${selectedShape}-${selectedLength}-${selectedSize}`,
      product,
      quantity: qty,
      shape: selectedShape,
      length: selectedLength,
      size: selectedSize,
      customSizes: null
    });
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#FDF8F4] text-[#3D2B1F] font-sans pb-24">
      <Navbar />
      
      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 pt-24 md:pt-28 pb-6 text-sm text-dark-400">
        <Link to="/" className="hover:text-rose-500">Home</Link> &gt; <Link to="/shop" className="hover:text-rose-500">Shop</Link> &gt; <span className="text-dark-800">{product.name}</span>
      </div>

      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Images Gallery */}
          <div className="w-full lg:w-1/2 flex flex-col-reverse lg:flex-row gap-4">
            <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible">
              {product.images?.map((img, i) => {
                const imgUrl = img?.url || img || '';
                return (
                  <button key={i} onClick={() => setActiveImage(imgUrl)} className={`w-20 h-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === imgUrl ? 'border-rose-500' : 'border-transparent hover:border-rose-200'}`}>
                    <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                );
              })}
            </div>
            <div className="flex-1 aspect-[3/4] lg:aspect-auto lg:h-[600px] rounded-2xl overflow-hidden bg-linen-100 relative shadow-card">
              <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-dark-800 mb-2">{product.name}</h1>
              <button onClick={handleWishlistToggle} className={`p-3 rounded-full bg-rose-50 border border-rose-100 hover:bg-rose-100 transition-colors ${isWishlisted ? 'text-rose-500' : 'text-dark-400'}`}>
                <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <StarRating rating={product.rating || 5} />
              <span className="text-sm text-dark-400">{product.reviewsCount || 12} Reviews</span>
            </div>

            <div className="flex items-center gap-3 mb-8">
              <span className="text-3xl font-bold text-rose-500">
                {formatINR(product.discountPrice || product.price)}
              </span>
              {product.discountPrice && product.discountPrice < product.price && (
                <>
                  <span className="text-lg text-dark-300 line-through">
                    {formatINR(product.price)}
                  </span>
                  <span className="bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                    {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Shape Selection */}
            <div className="mb-6">
              <div className="flex justify-between mb-3">
                <span className="font-semibold text-dark-800">Shape</span>
                <span className="text-dark-400">{selectedShape}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.shapes?.map(shape => (
                  <button key={shape} onClick={() => setSelectedShape(shape)} className={`px-5 py-2 rounded-full border transition-all ${selectedShape === shape ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-rose-200 hover:border-rose-300 text-dark-500'}`}>
                    {shape}
                  </button>
                ))}
              </div>
            </div>

            {/* Length Selection */}
            <div className="mb-6">
              <div className="flex justify-between mb-3">
                <span className="font-semibold text-dark-800">Length</span>
                <span className="text-dark-400">{selectedLength}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.lengths?.map(len => (
                  <button key={len} onClick={() => setSelectedLength(len)} className={`px-5 py-2 rounded-full border transition-all ${selectedLength === len ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-rose-200 hover:border-rose-300 text-dark-500'}`}>
                    {len}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-8 border-b border-rose-100 pb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-dark-800">Size</span>
                <button onClick={() => setIsSizeModalOpen(true)} className="text-sm flex items-center gap-1 text-rose-500 hover:text-rose-600">
                  <Ruler size={16} /> Size Guide
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {['S', 'M', 'L'].map(sz => (
                  <button key={sz} onClick={() => setSelectedSize(sz)} className={`py-2.5 rounded-lg border text-center transition-all font-medium ${selectedSize === sz ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-rose-200 hover:border-rose-300 text-dark-500'}`}>
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 mb-8">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Qty */}
                <div className="flex items-center justify-between border border-rose-200 rounded-xl px-4 py-3 sm:w-32 bg-white shrink-0">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="text-dark-400 hover:text-dark-700"><Minus size={18} /></button>
                  <span className="font-semibold text-lg">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} className="text-dark-400 hover:text-dark-700"><Plus size={18} /></button>
                </div>
                
                {/* Add to Cart */}
                <button onClick={handleAddToCart} className="flex-1 flex justify-center items-center gap-2 border-2 border-rose-500 text-rose-600 hover:bg-rose-50 rounded-xl py-3.5 font-semibold transition-all">
                  <ShoppingBag size={20} /> Add to Cart
                </button>

                {/* Buy Now */}
                <button onClick={handleBuyNow} className="flex-1 flex justify-center items-center gap-2 bg-gradient-to-r from-rose-500 to-rose-400 hover:from-rose-600 hover:to-rose-500 text-white rounded-xl py-3.5 font-semibold transition-all shadow-glow-rose hover:scale-[1.02]">
                  <Zap size={20} /> Buy Now
                </button>
              </div>
            </div>

            <a href={`https://wa.me/916394802184?text=Hi, I have a query about ${product.name}`} target="_blank" rel="noreferrer" className="w-full flex justify-center items-center gap-2 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 hover:bg-[#25D366]/20 rounded-xl py-3 font-medium transition-all mb-8">
              <MessageCircle size={20} /> Have a question? Ask on WhatsApp
            </a>

            {/* Perks */}
            <div className="grid grid-cols-2 gap-4 text-sm text-dark-500 bg-linen-100 p-4 rounded-xl border border-rose-100">
              <div className="flex items-center gap-2"><Truck size={18} className="text-rose-500" /> Free Shipping in India</div>
              <div className="flex items-center gap-2"><RotateCcw size={18} className="text-rose-500" /> Reusable up to 3 times</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-24 border-t border-rose-100 pt-12">
          <div className="flex gap-8 border-b border-rose-100 mb-8">
            {['description', 'reviews', 'shipping'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-4 font-display text-lg capitalize transition-all ${activeTab === tab ? 'text-rose-500 border-b-2 border-rose-500' : 'text-dark-400 hover:text-dark-600'}`}>
                {tab}
              </button>
            ))}
          </div>
          
          <div className="text-dark-500 leading-relaxed min-h-[200px]">
            {activeTab === 'description' && (
              <div className="space-y-4 max-w-3xl">
                <p>{product.description || 'Experience luxury at your fingertips. Our handcrafted press-on nails are designed with precision and care, using high-quality gel polish that guarantees a flawless finish.'}</p>
                <ul className="list-disc pl-5 space-y-2 text-dark-400 mt-6">
                  <li>Hand-painted by professional nail artists</li>
                  <li>Made with 100% gel polish (not plastic)</li>
                  <li>Durable, lightweight, and comfortable</li>
                  <li>Includes prep kit: glue, sticky tabs, file, buffer, cuticle pusher, and alcohol wipe</li>
                </ul>
              </div>
            )}
            {activeTab === 'reviews' && <p>Customer reviews will be displayed here.</p>}
            {activeTab === 'shipping' && <p>Free shipping on all orders across India. Orders are processed within 2-3 business days and delivered within 5-7 business days.</p>}
          </div>
        </div>
      </div>

      <Footer />
      <SizeGuideModal isOpen={isSizeModalOpen} onClose={() => setIsSizeModalOpen(false)} />
    </div>
  );
}
