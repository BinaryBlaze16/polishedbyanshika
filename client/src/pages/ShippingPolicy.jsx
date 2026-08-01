import React from 'react';
import { Truck, Clock, Globe, MapPin, Package, Phone, ShieldCheck, AlertTriangle } from 'lucide-react';
import PolicyLayout from '../components/PolicyLayout';
import usePublicSettings from '../hooks/usePublicSettings';


const Section = ({ icon: Icon, title, children }) => (
  <div className="mb-10">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center border border-rose-200/60 shrink-0">
        <Icon size={18} className="text-rose-500" />
      </div>
      <h2 className="text-xl font-display font-bold text-[#3D2B1F]">{title}</h2>
    </div>
    <div className="pl-12 space-y-3 text-[#6B5347] text-[0.92rem] leading-relaxed">
      {children}
    </div>
    <div className="mt-8 border-b border-rose-100" />
  </div>
);

const ShippingPolicy = () => {
  const { settings, whatsappUrl, instagramUrl, instagramHandle, emailUrl } = usePublicSettings();

  return (
    <PolicyLayout
      title="Shipping Policy"
      subtitle="Everything you need to know about how we pack and ship your handcrafted press-on nails."
      icon={Truck}
      updatedDate="August 1, 2025"
    >
      <Section icon={Clock} title="Order Processing Time">
        <p>
          At <strong>{settings.businessName}</strong>, every set of press-on nails is handcrafted to order with precision and care. Please allow <strong>3–5 business days</strong> for us to prepare your order before it is dispatched. During sale periods or high-demand seasons, processing may extend to <strong>5–7 business days</strong>. You will receive an email and WhatsApp notification once your parcel has been shipped.
        </p>
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          ⚠️ Custom and personalised nail sets (including custom shapes, lengths, and art) may require an additional 2–3 business days beyond standard processing time.
        </p>
      </Section>

      <Section icon={Truck} title="Shipping Methods & Partners">
        <p>We currently ship across India using trusted courier partners:</p>
        <ul className="list-none space-y-2 mt-2">
          {[
            'Delhivery – Standard delivery (India-wide)',
            'DTDC – Standard & Express delivery',
            'India Post – Remote areas & rural pin codes',
            'Ecom Express – Select cities',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-rose-400 mt-0.5">✦</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3">
          The shipping partner is assigned automatically based on your pin code to ensure the fastest and most reliable delivery.
        </p>
      </Section>

      <Section icon={Clock} title="Estimated Delivery Time">
        <div className="overflow-x-auto rounded-2xl border border-rose-100">
          <table className="w-full text-sm">
            <thead className="bg-rose-50 text-rose-700 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Location</th>
                <th className="px-4 py-3 text-left">Processing</th>
                <th className="px-4 py-3 text-left">Delivery</th>
                <th className="px-4 py-3 text-left">Total Estimate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-50 bg-white">
              {[
                ['Metro Cities (Delhi, Mumbai, Bangalore, etc.)', '3–5 days', '2–3 days', '5–8 days'],
                ['Tier 2 & 3 Cities', '3–5 days', '3–5 days', '6–10 days'],
                ['Remote & Rural Areas', '3–5 days', '5–7 days', '8–12 days'],
                ['J&K, NE States, Islands', '3–5 days', '7–10 days', '10–15 days'],
              ].map(([loc, proc, del, total]) => (
                <tr key={loc} className="hover:bg-rose-50/40 transition-colors">
                  <td className="px-4 py-3 font-medium text-[#3D2B1F]">{loc}</td>
                  <td className="px-4 py-3">{proc}</td>
                  <td className="px-4 py-3">{del}</td>
                  <td className="px-4 py-3 font-semibold text-rose-600">{total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-[#9B8A80]">
          * Delivery estimates are business days (Mon–Sat) and exclude public holidays.
        </p>
      </Section>

      <Section icon={Package} title="Shipping Charges">
        <p>We believe beautiful nails should be accessible, which is why we keep our shipping costs fair:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100">
            <p className="font-semibold text-rose-600 text-sm mb-1">Standard Shipping</p>
            <p className="text-2xl font-bold text-[#3D2B1F]">₹{settings.shippingCharge}</p>
            <p className="text-xs text-[#9B8A80] mt-1">On all orders below ₹{settings.freeShippingAbove}</p>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
            <p className="font-semibold text-emerald-600 text-sm mb-1">Free Shipping 🎉</p>
            <p className="text-2xl font-bold text-[#3D2B1F]">₹0</p>
            <p className="text-xs text-[#9B8A80] mt-1">On all orders above ₹{settings.freeShippingAbove}</p>
          </div>
        </div>
        <p className="mt-3 text-xs">
          Shipping charges are automatically calculated at checkout based on your order value.
        </p>
      </Section>

      <Section icon={MapPin} title="Order Tracking">
        <p>
          Once your order is dispatched, you will receive:
        </p>
        <ul className="list-none space-y-2 mt-2">
          {[
            'An email confirmation with your AWB/tracking number',
            'A WhatsApp message with the courier name and tracking link',
            'Live tracking updates via the courier partner&apos;s website or app',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-rose-400 mt-0.5">✦</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3">
          You can also track your order directly through your account on our website under <strong>My Orders → Track</strong>.
        </p>
      </Section>

      <Section icon={AlertTriangle} title="Shipping Delays">
        <p>
          While we do our best to ensure timely delivery, certain situations may cause delays beyond our control, including:
        </p>
        <ul className="list-none space-y-2 mt-2">
          {[
            'Extreme weather conditions or natural disasters',
            'Public holidays and national strikes',
            'Courier service delays and high-volume periods',
            'Customs or regulatory hold-ups (international only)',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">⚠</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3">
          We will proactively notify you if there is a significant delay in your shipment. Please contact us at <a href={emailUrl} className="text-rose-500 hover:underline">{settings.businessEmail}</a> if you have concerns.
        </p>
      </Section>

      <Section icon={MapPin} title="Incorrect Address Policy">
        <p>
          Please double-check your delivery address before placing your order. <strong>{settings.businessName} is not responsible for packages undelivered due to an incorrect or incomplete address</strong> provided by the customer.
        </p>
        <p className="mt-2">
          If you notice an address error immediately after placing your order, please contact us <strong>within 2 hours</strong> at <a href={whatsappUrl} className="text-rose-500 hover:underline" target="_blank" rel="noopener noreferrer">WhatsApp ({settings.businessWhatsapp})</a>. Once the order is dispatched, address corrections may not be possible and return-to-origin shipping costs will be borne by the customer.
        </p>
      </Section>

      <Section icon={ShieldCheck} title="Lost or Damaged Packages">
        <p>
          If your package is declared lost by the courier partner or arrives visibly damaged:
        </p>
        <ul className="list-none space-y-2 mt-2">
          {[
            'Contact us within 48 hours of the expected delivery date',
            'Share your order number and a photo/video of the damaged parcel',
            'We will initiate a courier investigation immediately',
            'If confirmed lost or damaged in transit, we will reship your order at no extra cost',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-rose-400 mt-0.5 font-bold text-xs">{i + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section icon={Globe} title="International Shipping">
        <p>
          We currently <strong>do not offer international shipping</strong>. We ship exclusively within India at this time. Please check back regularly as we are working on expanding globally very soon!
        </p>
        <p className="mt-2">
          If you are an international customer, follow us on{' '}
          <a href={instagramUrl} className="text-rose-500 hover:underline" target="_blank" rel="noopener noreferrer">
            {instagramHandle}
          </a>{' '}
          to be the first to know when international shipping goes live.
        </p>
      </Section>

      <Section icon={Phone} title="Contact Us">
        <p>For all shipping-related queries:</p>
        <ul className="list-none space-y-2 mt-2">
          <li className="flex items-start gap-2"><span className="text-rose-400">✦</span><span>📧 Email: <a href={emailUrl} className="text-rose-500 hover:underline">{settings.businessEmail}</a></span></li>
          <li className="flex items-start gap-2"><span className="text-rose-400">✦</span><span>💬 WhatsApp: <a href={whatsappUrl} className="text-rose-500 hover:underline" target="_blank" rel="noopener noreferrer">{settings.businessWhatsapp}</a></span></li>
          <li className="flex items-start gap-2"><span className="text-rose-400">✦</span><span>⏱ Response Time: Within 24 hours on business days (Mon–Sat, 10 AM – 7 PM)</span></li>
        </ul>
      </Section>
    </PolicyLayout>
  );
};

export default ShippingPolicy;
