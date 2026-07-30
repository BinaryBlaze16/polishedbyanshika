import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-rose-100 h-full flex flex-col animate-pulse shadow-card">
      {/* Image Skeleton */}
      <div className="w-full aspect-square bg-linen-200"></div>
      
      {/* Content Skeleton */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Title */}
        <div className="h-5 bg-linen-200 rounded-md w-3/4 mb-4"></div>
        
        {/* Rating */}
        <div className="flex gap-1 mb-4">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="w-3.5 h-3.5 bg-linen-200 rounded-full"></div>
          ))}
        </div>
        
        {/* Tags */}
        <div className="flex gap-2 mb-6 mt-auto">
          <div className="h-5 w-16 bg-rose-100 rounded-full"></div>
          <div className="h-5 w-16 bg-rose-100 rounded-full"></div>
        </div>
        
        {/* Footer (Price & Button) */}
        <div className="flex justify-between items-center mt-auto pt-3 border-t border-rose-50">
          <div className="h-6 w-20 bg-linen-200 rounded-md"></div>
          <div className="h-9 w-9 bg-rose-100 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
