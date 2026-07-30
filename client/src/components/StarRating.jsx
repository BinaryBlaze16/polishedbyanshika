import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const StarRating = ({ rating, size = 'md', interactive = false, onChange }) => {
  const sizeClasses = {
    sm: 14,
    md: 18,
    lg: 24
  };
  
  const iconSize = sizeClasses[size] || 18;
  const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));
  
  const handleClick = (idx) => {
    if (interactive && onChange) {
      onChange(idx + 1);
    }
  };

  return (
    <div className={`flex items-center gap-0.5 ${interactive ? 'cursor-pointer' : ''}`}>
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        const isHalf = safeRating >= starValue - 0.5 && safeRating < starValue;
        const isFilled = safeRating >= starValue;

        return (
          <div 
            key={index} 
            onClick={() => handleClick(index)}
            className={`transition-transform ${interactive ? 'hover:scale-110' : ''}`}
          >
            {isHalf ? (
              <StarHalf size={iconSize} className="fill-yellow-500 text-yellow-500" />
            ) : isFilled ? (
              <Star size={iconSize} className="fill-yellow-500 text-yellow-500" />
            ) : (
              <Star size={iconSize} className="text-gray-600" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;
