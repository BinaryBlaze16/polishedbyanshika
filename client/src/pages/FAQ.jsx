import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, ChevronUp, HelpCircle, ShoppingBag, Truck, Sparkles, CreditCard, RotateCcw, User, MessageCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import usePublicSettings from '../hooks/usePublicSettings';

const getFaqCategories = (settings, instagramHandle) => [
  {
    id: 'orders',
    label: 'Orders',
    icon: ShoppingBag,
    color: 'rose',
    faqs: [
      {
        q: 'How do I place an order?',
        a: 'Placing an order is simple! Browse our Shop, select your favourite nail set, choose your preferred shape, length, and size, then add it to your cart. When ready, proceed to checkout, fill in your delivery details, and complete payment via UPI or Cash on Delivery. You\'ll receive an order confirmation email and WhatsApp message immediately.'
      },
      {
        q: 'Can I cancel my order?',
        a: `Orders can be cancelled within 2 hours of placing them, provided production has not started. To cancel, message us immediately on WhatsApp (${settings.businessWhatsapp}) with your order number. Custom-made nail sets cannot be cancelled once production begins, as materials are specifically prepared for your order.`
      },
      {
        q: 'How do I track my order?',
        a: 'Once your order is dispatched, you\'ll receive an email and WhatsApp notification containing your AWB/tracking number and a direct tracking link. You can also log into your account on our website and visit "My Profile → Orders" to see live order status updates.'
      },
      {
        q: 'Can I modify my order after placing it?',
        a: 'We process orders quickly to maintain our handcrafting schedule. Size or design changes can only be accommodated within 1–2 hours of order placement. Please WhatsApp us immediately if you need to make changes. We cannot guarantee modifications once production has begun.'
      },
      {
        q: 'Do you accept custom nail orders?',
        a: 'Absolutely! We love creating personalised sets. Visit our "Custom Order" page to submit your requirements including desired design, colour palette, shape, length, and any reference images. Our team will review your request and get back to you with a quote within 24–48 hours.'
      },
    ]
  },
  {
    id: 'shipping',
    label: 'Shipping',
    icon: Truck,
    color: 'blue',
    faqs: [
      {
        q: 'How long does delivery take?',
        a: 'Every set is handcrafted to order, so please allow 3–5 business days for production, plus delivery time. Metro cities (Delhi, Mumbai, Bangalore) typically receive orders within 5–8 business days total. Other cities may take 6–12 business days. Remote areas and the North-East may take up to 15 business days.'
      },
      {
        q: 'Do you offer express shipping?',
        a: 'We currently ship via standard courier partners. Due to the handcrafted nature of our products, we need the full processing time to ensure quality. However, if you have an urgent order for a specific event, please WhatsApp us and we\'ll do our absolute best to accommodate you.'
      },
      {
        q: 'Do you ship internationally?',
        a: `We currently ship exclusively within India. We are actively working on expanding to international markets and hope to announce global shipping soon. Follow us on ${instagramHandle} on Instagram to be the first to know!`
      },
      {
        q: 'How much does shipping cost?',
        a: `Shipping is ₹${settings.shippingCharge} for orders below ₹${settings.freeShippingAbove}. Orders above ₹${settings.freeShippingAbove} qualify for FREE shipping automatically — no coupon code needed! The correct shipping cost is shown at checkout based on your order total.`
      },
      {
        q: 'What happens if my package is lost or damaged in transit?',
        a: 'If your package is lost or arrives damaged, please contact us within 48 hours of the expected delivery date with photos/videos of the damaged parcel and your order number. We will file a courier investigation and reship your order at no extra cost once the claim is confirmed.'
      },
    ]
  },
  {
    id: 'nails',
    label: 'Press-on Nails',
    icon: Sparkles,
    color: 'pink',
    faqs: [
      {
        q: 'How long do press-on nails last?',
        a: 'With proper application and care, our press-on nails can last anywhere from 7 to 21 days. Longevity depends on your daily activities, nail preparation, and the type of adhesive used. Avoiding prolonged water exposure and using nail glue (instead of adhesive tabs) will significantly extend wear time.'
      },
      {
        q: 'How do I apply press-on nails?',
        a: 'Step 1: Clean your natural nails with a nail buffer and wipe with isopropyl alcohol. Step 2: Select the correct size nail for each finger. Step 3: Apply a thin layer of nail glue to your natural nail or use the adhesive tab provided. Step 4: Press the nail at a 45° angle, starting from the cuticle, and hold firmly for 30 seconds. Avoid water for at least 1 hour after application.'
      },
      {
        q: 'How do I remove press-on nails safely?',
        a: 'Never force or peel your press-on nails off, as this can damage your natural nail. To remove safely: Soak your nails in warm soapy water for 10–15 minutes to loosen the adhesive. Gently wiggle from the side edges using a cuticle pusher or orange stick. If using nail glue, soak in acetone for a few minutes before lifting. Avoid pulling or forcing.'
      },
      {
        q: 'Can press-on nails be reused?',
        a: 'Yes! If removed gently and carefully, our press-on nails can be reused 2–3 times when applied with adhesive tabs. Once reusing, clean any residual adhesive from the nail, file if needed, and apply fresh adhesive tabs for the next use. Reusability depends on how carefully they are removed.'
      },
      {
        q: 'How do I choose the correct nail size?',
        a: 'Each product listing includes a size guide. Generally, measure the width of your natural nail in millimetres at its widest point. Our nails come in sizes 0–9 (or S/M/L sets). When in doubt, size slightly larger as a bigger nail can be filed down. Check our Size Guide page for a detailed visual chart. You can also request a custom fit in a custom order.'
      },
      {
        q: 'Are your nails safe for sensitive skin?',
        a: 'Our nails are made with high-quality ABS acrylic. The adhesive glue contains cyanoacrylate, which can cause reactions in some individuals. If you have a known sensitivity to nail glue or acrylics, we recommend performing a patch test on one nail first and waiting 24 hours before full application. Consult a dermatologist if you have concerns.'
      },
    ]
  },
  {
    id: 'payments',
    label: 'Payments',
    icon: CreditCard,
    color: 'green',
    faqs: [
      {
        q: 'Which payment methods are accepted?',
        a: 'We currently accept UPI payments (Google Pay, PhonePe, Paytm, BHIM, and all UPI-compatible apps) and Cash on Delivery (COD). We are continuously working to add more payment options.'
      },
      {
        q: 'Is Cash on Delivery (COD) available?',
        a: 'Yes! COD is available across most serviceable pin codes in India. Simply select "Cash on Delivery" at checkout. Please ensure you have the exact amount ready at the time of delivery, as our delivery partners may not carry change.'
      },
      {
        q: 'Are online payments secure?',
        a: 'Absolutely. All UPI transactions are processed through your trusted UPI application (GPay, PhonePe, etc.) using RBI-approved encrypted payment infrastructure. We never receive or store your UPI PIN, bank account details, or any sensitive payment credentials. Only the transaction UTR number is shared with us for order verification.'
      },
      {
        q: 'How do I confirm my UPI payment?',
        a: `After scanning our QR code or using our UPI ID (${settings.businessUpi}) to complete payment, note down your 12-digit UTR (Unique Transaction Reference) number from your payment app. Enter this UTR in the payment form on our website. This allows us to verify your payment and confirm your order.`
      },
      {
        q: 'What if my payment fails but money was deducted?',
        a: 'This is typically a temporary bank or payment gateway hold. Failed transaction amounts are automatically reversed to your account within 5–7 business days by your bank. If you don\'t receive a refund after this period, please contact your bank first. If the issue persists, reach out to us with your transaction details and we\'ll help resolve it.'
      },
    ]
  },
  {
    id: 'returns',
    label: 'Returns & Refunds',
    icon: RotateCcw,
    color: 'amber',
    faqs: [
      {
        q: 'Can I return custom nails?',
        a: 'Custom-made press-on nails are made specifically to your specifications and cannot be returned or exchanged, unless there is a manufacturing defect or we sent you the wrong item. Please review all details carefully before placing a custom order.'
      },
      {
        q: 'What if my product arrives damaged?',
        a: `We're sorry if that happens! Please take photos/videos of the damaged product and packaging within 48 hours of receiving your order, then WhatsApp (${settings.businessWhatsapp}) or email us (${settings.businessEmail}) with the evidence and your order number. Our team will arrange a free replacement or refund as quickly as possible.`
      },
      {
        q: 'I received the wrong item — what do I do?',
        a: 'We sincerely apologise for the mix-up! Please contact us within 48 hours with your order number and a photo of what you received. We will arrange a free return pickup and reship the correct item at no additional cost to you.'
      },
      {
        q: 'How long does a refund take?',
        a: 'Once a refund is approved, it is processed within 5–7 business days for UPI payments and 7–10 business days for COD orders (via bank transfer or UPI). Refund timelines begin from the date of approval, not the order date.'
      },
    ]
  },
  {
    id: 'account',
    label: 'Account',
    icon: User,
    color: 'purple',
    faqs: [
      {
        q: 'How do I reset my password?',
        a: `Currently, you can reset your password by visiting the Login page and clicking "Forgot Password." If you continue to face issues, contact us at ${settings.businessEmail} and our support team will assist you in securely resetting access to your account.`
      },
      {
        q: 'How do I manage my saved addresses?',
        a: 'Log into your account and visit "My Profile." Under the "Saved Addresses" section, you can add, edit, or delete delivery addresses. You can save multiple addresses (Home, Work, etc.) and select your preferred one at checkout.'
      },
      {
        q: 'How do I view my previous orders?',
        a: 'Log in to your account and click on your profile or visit "My Profile → Orders." You\'ll see a complete history of all past orders including their status, items, and tracking information.'
      },
      {
        q: 'Can I delete my account?',
        a: `Yes! You can delete your account and all associated data permanently by visiting "My Profile → Account Details" and clicking "Delete My Account & All Data". Alternatively, you can request account deletion by emailing us at ${settings.businessEmail}.`
      },
    ]
  },
  {
    id: 'support',
    label: 'Support',
    icon: MessageCircle,
    color: 'teal',
    faqs: [
      {
        q: 'How do I contact customer support?',
        a: `You can reach our team via WhatsApp (${settings.businessWhatsapp}), email (${settings.businessEmail}), or by DM on Instagram (${instagramHandle}). WhatsApp is typically the fastest way to get a response.`
      },
      {
        q: 'What are your business hours?',
        a: 'Our team is available Monday to Saturday, 10:00 AM – 7:00 PM IST. We are closed on Sundays and national public holidays. Messages received outside these hours will be responded to on the next business day.'
      },
      {
        q: 'What is the expected response time?',
        a: 'We aim to respond to all WhatsApp messages within 2–4 hours during business hours. Emails are typically answered within 24 hours. During high-demand periods (sales, festive seasons), response times may extend slightly, but we always respond within 48 hours.'
      },
    ]
  },
];

const colorMap = {
  rose: 'bg-rose-100 text-rose-600 border-rose-200',
  blue: 'bg-blue-100 text-blue-600 border-blue-200',
  pink: 'bg-pink-100 text-pink-600 border-pink-200',
  green: 'bg-emerald-100 text-emerald-600 border-emerald-200',
  amber: 'bg-amber-100 text-amber-600 border-amber-200',
  purple: 'bg-purple-100 text-purple-600 border-purple-200',
  teal: 'bg-teal-100 text-teal-600 border-teal-200',
};

const FAQItem = ({ faq, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border rounded-2xl overflow-hidden transition-all duration-300 ${open ? 'border-rose-200 shadow-sm bg-rose-50/30' : 'border-rose-100 bg-white hover:border-rose-200 hover:bg-rose-50/10'}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
        id={`faq-${index}`}
        aria-expanded={open}
      >
        <span className="font-semibold text-[#3D2B1F] text-sm leading-snug pr-2">{faq.q}</span>
        <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${open ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-500'}`}>
          {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96' : 'max-h-0'}`}
      >
        <div className="px-5 pb-5 text-sm text-[#6B5347] leading-relaxed border-t border-rose-100 pt-4">
          {faq.a}
        </div>
      </div>
    </div>
  );
};

const FAQ = () => {
  const { settings, whatsappUrl, emailUrl, instagramHandle } = usePublicSettings();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const faqCategories = useMemo(
    () => getFaqCategories(settings, instagramHandle),
    [settings, instagramHandle]
  );

  const filtered = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return faqCategories
      .filter(cat => activeCategory === 'all' || cat.id === activeCategory)
      .map(cat => ({
        ...cat,
        faqs: cat.faqs.filter(
          faq =>
            !lowerSearch ||
            faq.q.toLowerCase().includes(lowerSearch) ||
            faq.a.toLowerCase().includes(lowerSearch)
        )
      }))
      .filter(cat => cat.faqs.length > 0);
  }, [search, activeCategory, faqCategories]);

  const totalResults = filtered.reduce((sum, cat) => sum + cat.faqs.length, 0);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FDF8F4] pt-20">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-[#3D2B1F] via-[#5C3D2E] to-[#3D2B1F] overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-400 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-amber-400 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
            <div className="w-14 h-14 bg-rose-500/20 rounded-2xl flex items-center justify-center border border-rose-400/30 mx-auto mb-6">
              <HelpCircle size={28} className="text-rose-300" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white">
              Frequently Asked Questions
            </h1>
            <p className="text-white/60 mt-4 text-base md:text-lg max-w-xl mx-auto">
              Find quick answers to everything about our handmade press-on nails, orders, shipping, and more.
            </p>

            {/* Search Bar */}
            <div className="mt-8 max-w-xl mx-auto relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search questions... (e.g. 'how to remove', 'shipping time')"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-rose-400/60 focus:bg-white/15 transition-all text-sm"
              />
              {search && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/50">
                  {totalResults} result{totalResults !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Category Tabs */}
        <section className="sticky top-20 z-10 bg-[#FDF8F4]/95 backdrop-blur-sm border-b border-rose-100 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto gap-1 py-3 scrollbar-hide">
              <button
                onClick={() => setActiveCategory('all')}
                className={`shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${activeCategory === 'all' ? 'bg-rose-500 text-white shadow-sm' : 'text-[#6B5347] hover:bg-rose-50 hover:text-rose-600'}`}
              >
                All Topics ({faqCategories.reduce((sum, c) => sum + c.faqs.length, 0)})
              </button>
              {faqCategories.map(cat => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${activeCategory === cat.id ? 'bg-rose-500 text-white shadow-sm' : 'text-[#6B5347] hover:bg-rose-50 hover:text-rose-600'}`}
                  >
                    <Icon size={13} />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <HelpCircle size={48} className="text-rose-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#3D2B1F] mb-2">No results found</h3>
              <p className="text-[#9B8A80] text-sm">
                Try different search terms, or{' '}
                <a href="https://wa.me/916394802184" className="text-rose-500 hover:underline" target="_blank" rel="noopener noreferrer">
                  ask us directly on WhatsApp
                </a>
                .
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {filtered.map(cat => {
                const Icon = cat.icon;
                return (
                  <div key={cat.id} id={cat.id}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${colorMap[cat.color]}`}>
                        <Icon size={18} />
                      </div>
                      <h2 className="text-xl font-display font-bold text-[#3D2B1F]">{cat.label}</h2>
                      <span className="ml-auto text-xs text-[#9B8A80] font-medium">{cat.faqs.length} question{cat.faqs.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="space-y-3">
                      {cat.faqs.map((faq, i) => (
                        <FAQItem key={i} faq={faq} index={`${cat.id}-${i}`} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Still Need Help */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-gradient-to-br from-rose-50 to-amber-50 border border-rose-200/60 rounded-3xl p-8 text-center">
            <h3 className="text-xl font-display font-bold text-[#3D2B1F] mb-2">Didn't find your answer?</h3>
            <p className="text-[#6B5347] text-sm mb-6">
              Our team is available Mon–Sat, 10 AM – 7 PM IST. We typically respond within 2–4 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm gap-2"
              >
                💬 Chat on WhatsApp ({settings.businessWhatsapp})
              </a>
              <a
                href={emailUrl}
                className="btn-secondary text-sm gap-2"
              >
                ✉️ Email {settings.businessEmail}
              </a>
              <Link to="/custom-order" className="btn-gold text-sm gap-2">
                💅 Custom Order
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default FAQ;
