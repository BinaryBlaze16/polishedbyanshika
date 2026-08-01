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

const TermsOfService = () => {
  const { settings, whatsappUrl, instagramUrl, instagramHandle, emailUrl } = usePublicSettings();

  return (
    <PolicyLayout
      title="Terms of Service"
      subtitle="Please read these terms carefully before using our website or placing an order. By accessing our store, you agree to these terms."
      icon={FileText}
      updatedDate="August 1, 2025"
    >
      <div className="mb-10 bg-rose-50 border border-rose-100 rounded-2xl p-5">
        <p className="text-sm text-[#6B5347] leading-relaxed">
          These Terms of Service ("Terms") govern your use of the <strong>{settings.businessName}</strong> website and purchase of our products. By accessing our website or placing an order, you confirm that you have read, understood, and agreed to these Terms. If you disagree with any part, please do not use our services.
        </p>
      </div>

      <Section icon={FileText} title="1. Acceptance of Terms">
        <p>
          By using the {settings.businessName} website, you agree to be bound by these Terms of Service, our Privacy Policy, and our Shipping and Return policies. These terms apply to all visitors, customers, and users of the website. We reserve the right to update or modify these terms at any time, and it is your responsibility to review them periodically.
        </p>
      </Section>

      <Section icon={UserCheck} title="2. User Accounts">
        <p>
          To place an order, you may be required to create an account. When creating an account, you agree to:
        </p>
        <ul className="list-none space-y-2 mt-2">
          {[
            'Provide accurate, complete, and current information',
            'Maintain the security of your account password',
            'Be responsible for all activity that occurs under your account',
            'Notify us immediately of any unauthorized use of your account',
            'Not create accounts for fraudulent purposes or on behalf of others without authorisation',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-rose-400 mt-0.5">✦</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3">
          We reserve the right to suspend or terminate accounts that violate these terms or are used for fraudulent, abusive, or harmful activities.
        </p>
      </Section>

      <Section icon={ShoppingBag} title="3. Product Information & Accuracy">
        <p>
          We strive to display our handcrafted press-on nails as accurately as possible. However, please be aware that:
        </p>
        <ul className="list-none space-y-2 mt-2">
          {[
            'Colours may vary slightly due to your screen settings and photography lighting.',
            'Each set is handmade, so minor variations in nail art are a natural characteristic of handcrafted products, not a defect.',
            'Product availability is subject to stock levels and may change without notice.',
            'Custom orders are made specifically to your specifications and may not match exactly what is shown in inspiration images.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-rose-400 mt-0.5">✦</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section icon={CreditCard} title="4. Pricing & Payments">
        <p>
          All prices on our website are listed in Indian Rupees (INR) and are inclusive of all applicable taxes unless stated otherwise. We reserve the right to change prices at any time without prior notice. However, the price displayed at the time of order placement will apply to that transaction.
        </p>
        <p className="mt-2">
          We accept the following payment methods:
        </p>
        <ul className="list-none space-y-2 mt-2">
          {[
            'UPI payments (GPay, PhonePe, Paytm, and all UPI-supported apps)',
            'Cash on Delivery (COD) — available in select locations',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-rose-400 mt-0.5">✦</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2">
          For UPI payments, you will be required to submit your 12-digit UTR (Unique Transaction Reference) number as proof of payment to confirm your order.
        </p>
      </Section>

      <Section icon={ShoppingBag} title="5. Order Acceptance & Confirmation">
        <p>
          Placing an order on our website constitutes an offer to purchase, not a confirmed sale. We reserve the right to accept, refuse, or cancel any order for reasons including but not limited to:
        </p>
        <ul className="list-none space-y-2 mt-2">
          {[
            'Product unavailability or stock-out',
            'Suspected fraudulent or unauthorized payment',
            'Incorrect pricing due to typographical errors',
            'Inability to verify your delivery address',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <AlertTriangle size={13} className="text-amber-500 mt-0.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3">
          An order is confirmed only when you receive an order confirmation email from us. If your order is cancelled by us, any payments made will be refunded in full.
        </p>
      </Section>

      <Section icon={Truck} title="6. Shipping & Delivery">
        <p>
          We will make reasonable efforts to deliver your order within the estimated timeframe. However, delivery times are estimates and not guarantees. {settings.businessName} is not liable for delays caused by courier partners, weather, or other factors beyond our control. Please refer to our <strong>Shipping Policy</strong> for full details.
        </p>
      </Section>

      <Section icon={RotateCcw} title="7. Returns & Refunds">
        <p>
          Due to hygiene reasons, press-on nails that have been opened, tried on, or worn cannot be returned. We accept returns only in cases of genuine manufacturing defects, shipping damage, or incorrect items. Please refer to our <strong>Return & Refund Policy</strong> for complete information. By placing an order, you acknowledge and accept this policy.
        </p>
      </Section>

      <Section icon={Shield} title="8. Intellectual Property">
        <p>
          All content on the {settings.businessName} website — including nail art designs, photographs, product names, logos, branding, and written content — is the exclusive intellectual property of {settings.businessName} and is protected by applicable copyright and trademark laws.
        </p>
        <p className="mt-2">
          You may not copy, reproduce, distribute, republish, modify, or sell any of our content without explicit prior written permission. Sharing our products on social media with credit is encouraged and appreciated!
        </p>
      </Section>

      <Section icon={UserCheck} title="9. User Responsibilities & Prohibited Activities">
        <p>When using our website, you agree not to:</p>
        <ul className="list-none space-y-2 mt-2">
          {[
            'Use the website for any unlawful, fraudulent, or harmful purpose',
            'Submit false, misleading, or inaccurate information in any form',
            'Attempt to gain unauthorized access to any part of our website or systems',
            'Post abusive, offensive, or defamatory reviews or content',
            'Use automated bots, scrapers, or crawlers without our written consent',
            `Impersonate any person or entity, including ${settings.businessName} staff`,
            'Attempt to circumvent any security or verification measures',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-rose-400 mt-0.5">✦</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section icon={AlertTriangle} title="10. Limitation of Liability">
        <p>
          To the fullest extent permitted by applicable law, {settings.businessName} shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of, or inability to use, our website or products, even if we have been advised of the possibility of such damages.
        </p>
        <p className="mt-2">
          Our total liability for any claim arising from the use of our website or products shall not exceed the amount you paid for the specific order giving rise to the claim.
        </p>
        <p className="mt-2">
          We are not responsible for any individual reactions to product materials (e.g., adhesive sensitivities). Always perform a patch test before full application if you have sensitive skin.
        </p>
      </Section>

      <Section icon={Shield} title="11. Disclaimer of Warranties">
        <p>
          Our website and products are provided "as is" without warranties of any kind, either express or implied. We do not warrant that the website will be uninterrupted, error-free, or completely secure. We make no warranty about the accuracy, reliability, or completeness of any information on our website.
        </p>
      </Section>

      <Section icon={Gavel} title="12. Governing Law & Disputes">
        <p>
          These Terms of Service are governed by and construed in accordance with the laws of <strong>India</strong>. Any disputes arising from these Terms or your use of our services shall be subject to the exclusive jurisdiction of the courts of <strong>Uttar Pradesh, India</strong>.
        </p>
        <p className="mt-2">
          Before initiating any legal proceedings, we strongly encourage you to contact us to resolve the dispute amicably. Most issues can be resolved quickly and fairly through open communication.
        </p>
      </Section>

      <Section icon={FileText} title="13. Changes to These Terms">
        <p>
          We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to our website with an updated date. Your continued use of our website following any changes constitutes your acceptance of the revised terms.
        </p>
      </Section>

      <Section icon={Mail} title="14. Contact Information">
        <p>For questions, concerns, or notices regarding these Terms of Service:</p>
        <ul className="list-none space-y-2 mt-2">
          <li className="flex items-start gap-2"><span className="text-rose-400">✦</span><span>📧 Email: <a href={emailUrl} className="text-rose-500 hover:underline">{settings.businessEmail}</a></span></li>
          <li className="flex items-start gap-2"><span className="text-rose-400">✦</span><span>💬 WhatsApp: <a href={whatsappUrl} className="text-rose-500 hover:underline" target="_blank" rel="noopener noreferrer">{settings.businessWhatsapp}</a></span></li>
          <li className="flex items-start gap-2"><span className="text-rose-400">✦</span><span>📸 Instagram: <a href={instagramUrl} className="text-rose-500 hover:underline" target="_blank" rel="noopener noreferrer">{instagramHandle}</a></span></li>
        </ul>
      </Section>
    </PolicyLayout>
  );
};

export default TermsOfService;
