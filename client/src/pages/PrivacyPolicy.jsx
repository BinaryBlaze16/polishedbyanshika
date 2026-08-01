import React from 'react';
import { Shield, Database, Eye, Globe, Lock, Mail, Bell, Users } from 'lucide-react';
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

const PrivacyPolicy = () => {
  const { settings, whatsappUrl, instagramUrl, instagramHandle, emailUrl } = usePublicSettings();

  return (
    <PolicyLayout
      title="Privacy Policy"
      subtitle="We value your trust and are committed to protecting your personal information. Here's how we collect, use, and safeguard your data."
      icon={Shield}
      updatedDate="August 1, 2025"
    >
      <div className="mb-10 bg-rose-50 border border-rose-100 rounded-2xl p-5">
        <p className="text-sm text-[#6B5347] leading-relaxed">
          This Privacy Policy applies to <strong>{settings.businessName}</strong> ("we", "our", or "us") and describes how we collect, use, share, and protect your information when you visit our website or purchase from us. By using our services, you agree to the practices described in this policy.
        </p>
      </div>

      <Section icon={Database} title="Information We Collect">
        <p>We collect the following categories of information to provide and improve our services:</p>

        <div className="space-y-4 mt-3">
          <div className="bg-white border border-rose-100 rounded-2xl p-4">
            <h3 className="font-semibold text-[#3D2B1F] text-sm mb-2">👤 Account Information</h3>
            <p className="text-xs">Your name, email address, phone number, and account password when you register. Passwords are encrypted and never stored in plain text.</p>
          </div>
          <div className="bg-white border border-rose-100 rounded-2xl p-4">
            <h3 className="font-semibold text-[#3D2B1F] text-sm mb-2">📦 Order & Transaction Information</h3>
            <p className="text-xs">Items purchased, order value, delivery address, shipping details, and order history. This is required to fulfil and track your orders.</p>
          </div>
          <div className="bg-white border border-rose-100 rounded-2xl p-4">
            <h3 className="font-semibold text-[#3D2B1F] text-sm mb-2">💳 Payment Information</h3>
            <p className="text-xs">We accept UPI and Cash on Delivery. <strong>We do not store your UPI PIN, bank account numbers, or sensitive payment credentials on our servers.</strong> Payment processing is handled securely by your UPI application (GPay, PhonePe, Paytm). Only the UTR/transaction reference number is stored for order verification.</p>
          </div>
          <div className="bg-white border border-rose-100 rounded-2xl p-4">
            <h3 className="font-semibold text-[#3D2B1F] text-sm mb-2">🌐 Technical & Device Information</h3>
            <p className="text-xs">Browser type, device type, operating system, IP address, and pages visited. Collected automatically via web analytics to improve site performance.</p>
          </div>
          <div className="bg-white border border-rose-100 rounded-2xl p-4">
            <h3 className="font-semibold text-[#3D2B1F] text-sm mb-2">🍪 Cookies</h3>
            <p className="text-xs">We use essential cookies to maintain your shopping cart, session, and login state. We may use analytics cookies (e.g., Google Analytics) to understand site usage patterns. You can disable non-essential cookies in your browser settings.</p>
          </div>
        </div>
      </Section>

      <Section icon={Eye} title="How We Use Your Information">
        <p>We use your data solely for the following legitimate purposes:</p>
        <ul className="list-none space-y-2 mt-2">
          {[
            'Processing, fulfilling, and delivering your orders',
            'Sending order confirmations, dispatch notifications, and delivery updates',
            'Providing customer support and responding to enquiries',
            'Detecting and preventing fraud, abuse, and security threats',
            'Improving our website, product offerings, and customer experience',
            'Sending promotional emails or offers (only with your consent — you can unsubscribe anytime)',
            'Legal compliance and dispute resolution',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-rose-400 mt-0.5">✦</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section icon={Globe} title="Information Sharing">
        <p>
          <strong>We do not sell, rent, or trade your personal information to third parties.</strong> We only share your data with:
        </p>
        <ul className="list-none space-y-2 mt-3">
          {[
            {
              title: 'Shipping Partners',
              desc: 'Your name, phone number, and delivery address are shared with our courier partners (Delhivery, DTDC, India Post) solely for the purpose of delivering your order.'
            },
            {
              title: 'Cloud Service Providers',
              desc: 'We use secure, encrypted cloud services (Railway, MongoDB Atlas, Cloudinary) to store our application data under strict data protection agreements.'
            },
            {
              title: 'Analytics',
              desc: 'Anonymised, aggregated usage data may be processed by analytics tools such as Google Analytics to help us understand traffic patterns.'
            },
            {
              title: 'Legal Requirements',
              desc: 'We may disclose information if required by law, court order, or government authority.'
            },
          ].map((item) => (
            <div key={item.title} className="p-4 bg-rose-50/60 rounded-2xl border border-rose-100">
              <p className="font-semibold text-[#3D2B1F] text-sm mb-1">{item.title}</p>
              <p className="text-xs text-[#9B8A80]">{item.desc}</p>
            </div>
          ))}
        </ul>
      </Section>

      <Section icon={Lock} title="Data Security">
        <p>
          We take the security of your personal information seriously. We implement industry-standard measures including:
        </p>
        <ul className="list-none space-y-2 mt-2">
          {[
            'HTTPS/TLS encryption for all data transmitted between your browser and our servers',
            'Bcrypt hashing for all stored passwords — never stored in plain text',
            'JWT-based session authentication with limited expiry',
            'Role-based access control — only authorised personnel can access customer data',
            'Regular security audits and dependency updates',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-rose-400 mt-0.5">🔒</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
          ⚠️ No method of internet transmission is 100% secure. While we do our utmost to protect your data, we cannot guarantee absolute security. Please use strong, unique passwords for your account.
        </p>
      </Section>

      <Section icon={Database} title="Data Retention">
        <p>
          We retain your personal data only for as long as necessary to fulfil the purposes for which it was collected:
        </p>
        <ul className="list-none space-y-2 mt-2">
          {[
            'Account data: Retained as long as your account is active, or up to 3 years after last activity',
            'Order records: Retained for 5 years for financial and legal compliance',
            'Analytics data: Retained in anonymised form for up to 2 years',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-rose-400 mt-0.5">✦</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3">
          You may delete your account and all associated data directly from your profile settings page, or request deletion by contacting us.
        </p>
      </Section>

      <Section icon={Users} title="Your Rights">
        <p>As our customer, you have the following rights regarding your personal data:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          {[
            { icon: '📋', right: 'Right to Access', desc: 'Request a copy of all personal data we hold about you.' },
            { icon: '✏️', right: 'Right to Rectification', desc: 'Correct inaccurate or outdated information in your profile.' },
            { icon: '🗑️', right: 'Right to Deletion', desc: 'Delete your account and all associated data directly from your Profile settings.' },
            { icon: '⛔', right: 'Right to Object', desc: 'Opt out of marketing communications at any time.' },
            { icon: '📤', right: 'Data Portability', desc: 'Request your data in a portable, machine-readable format.' },
            { icon: '⏸️', right: 'Right to Restrict', desc: 'Request that we limit how your data is processed in certain circumstances.' },
          ].map((item) => (
            <div key={item.right} className="bg-white border border-rose-100 rounded-2xl p-4">
              <div className="text-xl mb-1">{item.icon}</div>
              <p className="font-semibold text-[#3D2B1F] text-xs mb-1">{item.right}</p>
              <p className="text-[10px] text-[#9B8A80]">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-4">To exercise any of these rights, contact us at <a href={emailUrl} className="text-rose-500 hover:underline">{settings.businessEmail}</a>.</p>
      </Section>

      <Section icon={Bell} title="Marketing Communications">
        <p>
          We may send you promotional emails, WhatsApp messages, or SMS notifications about new collections, special offers, and nail care tips — but <strong>only if you have opted in</strong>. You can unsubscribe at any time by:
        </p>
        <ul className="list-none space-y-2 mt-2">
          {[
            'Clicking "Unsubscribe" in any marketing email',
            'Replying STOP to any WhatsApp marketing message',
            `Emailing us at ${settings.businessEmail} with "Unsubscribe" in the subject line`,
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-rose-400 mt-0.5">✦</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2">
          Note: Even if you opt out of marketing, we will still send you transactional communications (order confirmations, dispatch notifications) as these are essential to your service.
        </p>
      </Section>

      <Section icon={Users} title="Children's Privacy">
        <p>
          Our website is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately and we will delete such information promptly.
        </p>
      </Section>

      <Section icon={Globe} title="Updates to This Policy">
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of material changes by posting the updated policy on this page with a revised "Last Updated" date. Continued use of our website after an update constitutes your acceptance of the revised policy.
        </p>
      </Section>

      <Section icon={Mail} title="Contact Us">
        <p>For any privacy-related questions, data requests, or complaints:</p>
        <ul className="list-none space-y-2 mt-2">
          <li className="flex items-start gap-2"><span className="text-rose-400">✦</span><span>📧 Email: <a href={emailUrl} className="text-rose-500 hover:underline">{settings.businessEmail}</a></span></li>
          <li className="flex items-start gap-2"><span className="text-rose-400">✦</span><span>💬 WhatsApp: <a href={whatsappUrl} className="text-rose-500 hover:underline" target="_blank" rel="noopener noreferrer">{settings.businessWhatsapp}</a></span></li>
          <li className="flex items-start gap-2"><span className="text-rose-400">✦</span><span>📸 Instagram: <a href={instagramUrl} className="text-rose-500 hover:underline" target="_blank" rel="noopener noreferrer">{instagramHandle}</a></span></li>
        </ul>
      </Section>
    </PolicyLayout>
  );
};

export default PrivacyPolicy;
