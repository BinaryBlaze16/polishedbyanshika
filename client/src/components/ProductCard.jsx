import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import useWishlistStore from '../store/useWishlistStore';
import useCartStore from '../store/useCartStore';
import { formatINR } from '../utils/formatCurrency';
import StarRating from './StarRating';
import { showSuccess } from './Toast';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  const productId = product._id || product.id;
  const isWished = isInWishlist(productId);

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
    showSuccess(isWished ? 'Removed from wishlist' : 'Added to wishlist! 💕');
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    // Default config if adding directly from card
    const defaultShape = product.shapes?.[0] || 'Almond';
    const defaultLength = product.lengths?.[0] || 'Medium';
    const defaultSize = 'Medium';
    addItem({
      id: `${product._id || product.id}-${defaultShape}-${defaultLength}-${defaultSize}`,
      product,
      quantity: 1,
      shape: defaultShape,
      length: defaultLength,
      size: defaultSize,
      customSizes: null
    });
    showSuccess('Added to cart');
  };

  const discountPercent = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div 
      className="group relative bg-white rounded-2xl overflow-hidden border border-rose-100 hover:border-rose-300 transition-all duration-300 hover:shadow-card-hover cursor-pointer flex flex-col h-full shadow-card"
      onClick={() => navigate(`/product/${product.slug}`)}
    >
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-linen-100">
        <img 
          src={product.images?.[0]?.url || 'https://via.placeholder.com/400?text=No+Image'} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
        />
        
        {/* Wishlist Button */}
        <button 
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm border border-rose-100 hover:bg-white transition-colors z-10 shadow-sm"
        >
          <Heart 
            size={18} 
            className={`transition-colors ${isWished ? 'fill-rose-500 text-rose-500' : 'text-dark-400'}`} 
          />
        </button>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg z-10">
            {discountPercent}% OFF
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-dark-800 text-base truncate mb-1" title={product.name}>
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={product.ratings || 0} size="sm" />
          <span className="text-xs text-dark-400">({product.numReviews || 0})</span>
        </div>

        {/* Shapes Pills */}
        <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
          {product.shapes?.slice(0, 3).map(shape => (
            <span key={shape} className="text-[10px] px-2 py-0.5 rounded-full border border-rose-100 bg-rose-50 text-rose-600">
              {shape}
            </span>
          ))}
          {product.shapes?.length > 3 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full border border-rose-100 bg-rose-50 text-rose-600">
              +{product.shapes.length - 3}
            </span>
          )}
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-rose-50">
          <div className="flex flex-col">
            <span className="text-rose-500 font-bold text-lg leading-tight">
              {formatINR(product.discountPrice || product.price)}
            </span>
            {product.discountPrice && (
              <span className="text-xs text-dark-300 line-through">
                {formatINR(product.price)}
              </span>
            )}
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-300 group/btn"
          >
            <ShoppingCart size={18} className="group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
