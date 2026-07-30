import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  return (
    <Link 
      to={`/shop?category=${category.slug || category.name.toLowerCase()}`}
      className="group block min-w-[280px] sm:min-w-[320px] shrink-0 h-48 rounded-2xl overflow-hidden relative border border-rose-100 hover:border-rose-300 transition-all duration-300 shadow-card hover:shadow-card-hover"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={category.image || 'https://via.placeholder.com/600x400?text=Category'} 
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#3D2B1F] via-[#3D2B1F]/60 to-transparent opacity-90"></div>
      </div>
      
      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <h3 className="text-2xl font-display font-bold text-white mb-2 group-hover:text-rose-300 transition-colors">
          {category.name}
        </h3>
        <p className="text-sm text-linen-300 line-clamp-2 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100">
          {category.description || 'Explore our exclusive collection designed just for you.'}
        </p>
        
        {/* Glow effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 shadow-[inset_0_0_50px_rgba(183,110,121,0.15)] transition-opacity duration-300 pointer-events-none rounded-2xl"></div>
      </div>
    </Link>
  );
};

export default CategoryCard;
