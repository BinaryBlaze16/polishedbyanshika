import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-[#FDF8F4] flex flex-col items-center justify-center z-50">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-t-2 border-[#B76E79] border-opacity-20 rounded-full"></div>
        <div className="absolute inset-0 border-t-2 border-[#B76E79] rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-t-2 border-[#C9956B] border-opacity-20 rounded-full"></div>
        <div className="absolute inset-2 border-t-2 border-[#C9956B] rounded-full animate-spin animation-delay-150"></div>
      </div>
      <h2 className="mt-6 text-xl font-medium tracking-widest text-gradient-rose uppercase">
        Polished By Anshika
      </h2>
      <p className="mt-2 text-sm text-[#6B5347]">Curating luxury...</p>
    </div>
  );
};

export default LoadingSpinner;
