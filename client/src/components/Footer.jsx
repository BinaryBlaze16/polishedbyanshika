import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Mail, MessageCircle, Heart } from 'lucide-react';
import logoImg from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-[#3D2B1F] text-linen-300 relative overflow-hidden">
      {/* Decorative top gradient line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-rose-500/60 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand Col */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <img src={logoImg} alt="Polished by Anshika" className="h-12 w-12 rounded-full object-cover border border-white/20" />
              <span className="font-display text-xl font-bold bg-gradient-to-r from-rose-300 to-gold-400 bg-clip-text text-transparent">
                Polished by Anshika
              </span>
            </Link>
            <p className="text-sm text-linen-400 leading-relaxed">
              Premium handmade press-on nails crafted with love and attention to detail. 
              Elevate your style with salon-quality nails in minutes.
            </p>
            <p className="text-rose-300 font-medium flex items-center gap-2 text-sm">
              Handcrafted with love <Heart size={16} className="fill-rose-300" />
            </p>
          </div>

          {/* Quick Links Col */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6 tracking-wide">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link to="/shop" className="text-linen-400 hover:text-rose-300 transition-colors text-sm">Shop All</Link></li>
              <li><Link to="/custom-order" className="text-linen-400 hover:text-rose-300 transition-colors text-sm">Custom Orders</Link></li>
              <li><Link to="/profile" className="text-linen-400 hover:text-rose-300 transition-colors text-sm">Track Order</Link></li>
              <li><Link to="/faq" className="text-linen-400 hover:text-rose-300 transition-colors text-sm">FAQs</Link></li>
            </ul>
          </div>

          {/* Info Col */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6 tracking-wide">Information</h3>
            <ul className="space-y-4">
              <li><Link to="/shipping-policy" className="text-linen-400 hover:text-rose-300 transition-colors text-sm">Shipping Policy</Link></li>
              <li><Link to="/return-policy" className="text-linen-400 hover:text-rose-300 transition-colors text-sm">Return Policy</Link></li>
              <li><Link to="/privacy-policy" className="text-linen-400 hover:text-rose-300 transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-linen-400 hover:text-rose-300 transition-colors text-sm">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6 tracking-wide">Connect With Us</h3>
            <div className="flex space-x-4 mb-6">
              <a href="https://instagram.com/polished_by_anshika" target="_blank" rel="noopener noreferrer" 
                 className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-pink-500/20 hover:text-pink-300 transition-all border border-white/10 hover:border-pink-400/50">
                <ExternalLink size={20} />
              </a>
              <a href="https://wa.me/916394802184" target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-green-500/20 hover:text-green-300 transition-all border border-white/10 hover:border-green-400/50">
                <MessageCircle size={20} />
              </a>
              <a href="mailto:polishedbyanshika@gmail.com" 
                 className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-rose-500/20 hover:text-rose-300 transition-all border border-white/10 hover:border-rose-400/50">
                <Mail size={20} />
              </a>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-white text-sm font-medium">Subscribe to Newsletter</h4>
              <form className="flex" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="bg-white/5 border border-white/10 rounded-l-lg px-4 py-2 text-sm w-full focus:outline-none focus:border-rose-400/50 text-white placeholder-white/30"
                />
                <button type="submit" className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-r-lg text-sm font-medium transition-colors">
                  Notify Me
                </button>
              </form>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5">
              <p className="text-xs text-linen-500">Secure UPI payments accepted</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-linen-500">
            &copy; {new Date().getFullYear()} Polished By Anshika. All rights reserved.
          </p>
          <p className="text-xs text-linen-500 flex items-center gap-1">
            Made with <span className="text-rose-400">💅</span> for nail lovers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
