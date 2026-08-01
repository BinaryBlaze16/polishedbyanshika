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

const ReturnPolicy = () => {
  const { settings, whatsappUrl, emailUrl } = usePublicSettings();

  return (
    <PolicyLayout
      title="Return & Refund Policy"
      subtitle="We stand behind every set of nails we create. Here's how we handle returns, replacements, and refunds."
      icon={RotateCcw}
      updatedDate="August 1, 2025"
    >
      {/* Hygiene Notice Banner */}
      <div className="mb-10 bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4">
        <AlertTriangle size={22} className="text-amber-500 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-amber-800 mb-1">Important: Hygiene Policy on Returns</h3>
          <p className="text-sm text-amber-700 leading-relaxed">
            Due to strict hygiene and safety reasons, <strong>press-on nails that have been tried on, worn, or have the protective film removed cannot be returned or exchanged</strong>. This policy exists to protect both our customers and the integrity of our handmade products. Returns are only accepted in the specific cases outlined below.
          </p>
        </div>
      </div>

      <Section icon={CheckCircle} title="When Are Returns Eligible?">
        <p>We accept returns and provide a full resolution in the following situations:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {[
            { icon: '📦', title: 'Damaged in Transit', desc: 'Product arrived broken, crushed, or damaged due to shipping.' },
            { icon: '🎨', title: 'Manufacturing Defect', desc: 'Visible flaw or defect in the nail art that was not shown in the product listing.' },
            { icon: '❌', title: 'Wrong Item Received', desc: 'You received a completely different product, design, or size than what you ordered.' },
            { icon: '📭', title: 'Missing Items', desc: 'Entire order or individual items were missing from the package on delivery.' },
          ].map((item) => (
            <div key={item.title} className="bg-white border border-rose-100 rounded-2xl p-4">
              <div className="text-2xl mb-2">{item.icon}</div>
              <p className="font-semibold text-[#3D2B1F] text-sm mb-1">{item.title}</p>
              <p className="text-xs text-[#9B8A80]">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section icon={XCircle} title="What Cannot Be Returned?">
        <p>The following are explicitly non-returnable:</p>
        <ul className="list-none space-y-2 mt-2">
          {[
            'Press-on nails that have been applied or worn, even briefly',
            'Products with the protective seal or film removed',
            'Custom or personalised nail sets ordered to specific measurements',
            'Sale or discounted items (unless defective)',
            'Products returned beyond the 48-hour reporting window',
            'Items without original packaging',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <XCircle size={14} className="text-rose-400 mt-0.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section icon={Clock} title="How to Report an Issue">
        <p>
          If your order qualifies for a return or replacement, please follow these steps <strong>within 48 hours of receiving your package</strong>:
        </p>
        <div className="space-y-3 mt-3">
          {[
            { step: '1', title: 'Document the issue', desc: 'Take clear photos and/or a video of the product and its packaging, including the shipping label.' },
            { step: '2', title: 'Contact us', desc: `Send your evidence via WhatsApp (${settings.businessWhatsapp}) or email (${settings.businessEmail}) with your order number.` },
            { step: '3', title: 'Review & approval', desc: 'Our team will review your claim within 24–48 hours and confirm the resolution.' },
            { step: '4', title: 'Replacement or refund', desc: 'We will either reship your order or initiate a refund based on your preference and product availability.' },
          ].map((item) => (
            <div key={item.step} className="flex gap-4 p-4 bg-rose-50/60 rounded-2xl border border-rose-100">
              <div className="w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                {item.step}
              </div>
              <div>
                <p className="font-semibold text-[#3D2B1F] text-sm">{item.title}</p>
                <p className="text-xs text-[#9B8A80] mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section icon={RotateCcw} title="Replacement Policy">
        <p>
          For eligible claims, we prefer to offer a <strong>free replacement</strong> of the exact same item before processing a monetary refund. If the item is out of stock or unavailable, we will offer:
        </p>
        <ul className="list-none space-y-2 mt-2">
          {[
            'A store credit of equal value, valid for 90 days',
            'An exchange for a product of equal or lesser value',
            'A full refund to the original payment method',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-rose-400 mt-0.5">✦</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section icon={Package} title="Return Shipping">
        <p>
          For approved returns, <strong>{settings.businessName} will bear the return shipping cost</strong> by providing a prepaid shipping label. Please do not ship items back before receiving approval and a return authorisation from us, as unapproved returns cannot be processed.
        </p>
      </Section>

      <Section icon={CreditCard} title="Refund Processing">
        <p>
          Once a refund is approved and the return is verified (if required):
        </p>
        <div className="overflow-x-auto rounded-2xl border border-rose-100 mt-4">
          <table className="w-full text-sm">
            <thead className="bg-rose-50 text-rose-700 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Payment Method</th>
                <th className="px-4 py-3 text-left">Refund Timeline</th>
                <th className="px-4 py-3 text-left">Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-50 bg-white">
              {[
                ['UPI / Online Payment', '5–7 business days', 'Original payment source'],
                ['Cash on Delivery (COD)', '7–10 business days', 'Bank transfer / UPI'],
                ['Coupon / Store Credit', 'Instant on approval', 'Digital store credit'],
              ].map(([method, timeline, mode]) => (
                <tr key={method} className="hover:bg-rose-50/40 transition-colors">
                  <td className="px-4 py-3 font-medium text-[#3D2B1F]">{method}</td>
                  <td className="px-4 py-3">{timeline}</td>
                  <td className="px-4 py-3 text-rose-600 font-medium">{mode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-[#9B8A80] mt-3">
          Refund timelines begin from the date of return confirmation, not from the date of original purchase.
        </p>
      </Section>

      <Section icon={Heart} title="Cancellation Policy">
        <p>
          We process orders very quickly to maintain our handcrafting schedule. Cancellations are accepted <strong>only within 2 hours of placing the order</strong>, provided the order has not yet entered production.
        </p>
        <p className="mt-2">
          To cancel, please message us immediately on{' '}
          <a href={whatsappUrl} className="text-rose-500 hover:underline" target="_blank" rel="noopener noreferrer">WhatsApp ({settings.businessWhatsapp})</a>{' '}
          with your order number. Custom nail orders <strong>cannot be cancelled</strong> once production has started, as materials are cut and prepared specifically for your order.
        </p>
      </Section>

      <Section icon={Phone} title="Contact Support">
        <p>For any return, refund, or cancellation queries:</p>
        <ul className="list-none space-y-2 mt-2">
          <li className="flex items-start gap-2"><span className="text-rose-400">✦</span><span>📧 Email: <a href={emailUrl} className="text-rose-500 hover:underline">{settings.businessEmail}</a></span></li>
          <li className="flex items-start gap-2"><span className="text-rose-400">✦</span><span>💬 WhatsApp: <a href={whatsappUrl} className="text-rose-500 hover:underline" target="_blank" rel="noopener noreferrer">{settings.businessWhatsapp}</a></span></li>
          <li className="flex items-start gap-2"><span className="text-rose-400">✦</span><span>⏱ Response time: Within 24 hours, Monday – Saturday (10 AM – 7 PM IST)</span></li>
        </ul>
      </Section>
    </PolicyLayout>
  );
};

export default ReturnPolicy;
