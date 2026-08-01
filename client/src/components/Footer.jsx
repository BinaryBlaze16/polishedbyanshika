import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Mail, MessageCircle, Heart } from 'lucide-react';
import logoImg from '../assets/logo.png';
import usePublicSettings from '../hooks/usePublicSettings';

const Footer = () => {
  const { settings, whatsappUrl, instagramUrl, instagramHandle, emailUrl } = usePublicSettings();

  return (
    <footer className="bg-[#3D2B1F] text-linen-300 relative overflow-hidden">
      {/* Decorative top gradient line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-rose-500/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10 lg:pt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand Col */}
          <div className="space-y-5">
            <Link to="/" className="flex items-center gap-3">
              <img src={logoImg} alt={settings.businessName} className="h-12 w-12 rounded-full object-cover border border-white/20" />
              <span className="font-display text-xl font-bold bg-gradient-to-r from-rose-300 to-gold-400 bg-clip-text text-transparent">
                {settings.businessName}
              </span>
            </Link>
            <p className="text-sm text-linen-400 leading-relaxed">
              Premium handmade press-on nails crafted with love and attention to detail.
              Elevate your style with salon-quality nails in minutes.
            </p>
            <p className="text-rose-300 font-medium flex items-center gap-2 text-sm">
              Handcrafted with love <Heart size={15} className="fill-rose-300" />
            </p>
            {/* Social Icons */}
            <div className="flex gap-3 pt-1">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-pink-500/20 hover:text-pink-300 transition-all border border-white/10 hover:border-pink-400/50"
              >
                <ExternalLink size={16} />
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-green-500/20 hover:text-green-300 transition-all border border-white/10 hover:border-green-400/50"
              >
                <MessageCircle size={16} />
              </a>
              <a
                href={emailUrl}
                aria-label="Email"
                className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-rose-500/20 hover:text-rose-300 transition-all border border-white/10 hover:border-rose-400/50"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links Col */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { to: '/shop', label: 'Shop All' },
                { to: '/custom-order', label: 'Custom Orders' },
                { to: '/profile', label: 'Track My Order' },
                { to: '/faq', label: 'FAQs' },
                { to: '/wishlist', label: 'Wishlist' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-linen-400 hover:text-rose-300 transition-colors text-sm flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-rose-500/40 group-hover:bg-rose-400 transition-colors shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support Col */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Customer Support</h3>
            <ul className="space-y-3">
              {[
                { to: '/faq', label: 'FAQs' },
                { to: '/shipping-policy', label: 'Shipping Policy' },
                { to: '/return-policy', label: 'Return & Refund Policy' },
                { to: '/privacy-policy', label: 'Privacy Policy' },
                { to: '/terms', label: 'Terms of Service' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-linen-400 hover:text-rose-300 transition-colors text-sm flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-rose-500/40 group-hover:bg-rose-400 transition-colors shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Get in Touch</h3>
            <div className="space-y-3 text-sm text-linen-400">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-green-300 transition-colors"
              >
                <MessageCircle size={14} className="shrink-0" />
                <span>{settings.businessWhatsapp}</span>
              </a>
              <a
                href={emailUrl}
                className="flex items-center gap-2 hover:text-rose-300 transition-colors"
              >
                <Mail size={14} className="shrink-0" />
                <span>{settings.businessEmail}</span>
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-pink-300 transition-colors"
              >
                <ExternalLink size={14} className="shrink-0" />
                <span>{instagramHandle}</span>
              </a>
            </div>

            <div className="mt-6">
              <h4 className="text-white text-xs font-semibold mb-3 uppercase tracking-wider">Newsletter</h4>
              <form className="flex" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-white/5 border border-white/10 rounded-l-xl px-3 py-2 text-xs w-full focus:outline-none focus:border-rose-400/50 text-white placeholder-white/30"
                />
                <button
                  type="submit"
                  className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-2 rounded-r-xl text-xs font-medium transition-colors whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-xs text-linen-500">🔒 Secure UPI & COD payments</p>
              <p className="text-xs text-linen-500 mt-1">⏱ Support: Mon–Sat, 10AM–7PM IST</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-linen-500">
            &copy; {new Date().getFullYear()} {settings.businessName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-linen-500">
            <Link to="/privacy-policy" className="hover:text-rose-300 transition-colors">Privacy</Link>
            <span className="opacity-30">•</span>
            <Link to="/terms" className="hover:text-rose-300 transition-colors">Terms</Link>
            <span className="opacity-30">•</span>
            <Link to="/shipping-policy" className="hover:text-rose-300 transition-colors">Shipping</Link>
          </div>
          <p className="text-xs text-linen-500 flex items-center gap-1">
            Made with <span className="text-rose-400">💅</span> for nail lovers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
