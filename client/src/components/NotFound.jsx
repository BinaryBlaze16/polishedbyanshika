import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#FDF8F4] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#B76E79] rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-[#C9956B] rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-blob animation-delay-2000"></div>
      
      {/* Floating Nails */}
      <div className="absolute top-20 left-10 text-4xl animate-bounce" style={{ animationDuration: '3s' }}>💅</div>
      <div className="absolute bottom-40 right-20 text-5xl animate-bounce" style={{ animationDuration: '4s' }}>✨</div>
      <div className="absolute top-40 right-40 text-3xl animate-bounce" style={{ animationDuration: '2.5s' }}>💖</div>

      <div className="z-10 text-center space-y-6 glass-card p-12 max-w-md mx-4">
        <h1 className="text-8xl font-bold text-gradient-rose">404</h1>
        <h2 className="text-2xl font-semibold text-dark-800">Oops! Page not found</h2>
        <p className="text-[#6B5347]">
          Looks like the perfect set of nails you were looking for doesn't exist on this page.
        </p>
        <div className="pt-6">
          <Link to="/" className="btn-primary w-full">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
