const sendEmail = async ({ to, subject, html, from }) => {
  try {
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_demo') {
      const defaultFromEmail = process.env.FROM_EMAIL || 'orders@polishedbyanshika.in';
      const businessName = process.env.BUSINESS_NAME || 'PolishedByAnshika';
      const senderAddress = from || `${businessName} <${defaultFromEmail}>`;

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: senderAddress,
          to: Array.isArray(to) ? to : [to],
          subject,
          html,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Resend API Error:', errorData);
        return { success: false, error: errorData };
      }

      const data = await response.json();
      console.log('✅ Email successfully sent via Resend:', data.id);
      return { success: true, data };
    } else {
      console.log('--- EMAIL MOCK (Resend API key not configured or set to demo) ---');
      console.log(`From: ${from || 'default'}`);
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Content: ${html.substring(0, 150)}...`);
      console.log('-----------------------------------------------------------------');
      return { success: true, mock: true };
    }
  } catch (error) {
    console.error('❌ Error in sendEmail helper:', error.message);
    return { success: false, error: error.message };
  }
};

// ─── 1. Welcome Greeting Email (Sent from no-reply@polishedbyanshika.in) ─────
const sendWelcomeEmail = async (user) => {
  const businessName = process.env.BUSINESS_NAME || 'PolishedByAnshika';
  const siteUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',')[0] : 'https://polishedbyanshika.in';
  const subject = `Welcome to ${businessName}! 💅✨`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #fce7f3; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #fdf2f8;">
        <h1 style="color: #ec4899; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">💅 ${businessName}</h1>
        <p style="color: #6b7280; margin: 6px 0 0 0; font-size: 14px;">Luxury Handmade Press-On Nails</p>
      </div>

      <div style="padding: 24px 0;">
        <h2 style="color: #1f2937; font-size: 20px; margin-top: 0;">Welcome to the family, ${user.name}! 👋💖</h2>
        <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
          Thank you for creating an account with us. We craft bespoke, salon-quality press-on nail sets designed to be 100% reusable, durable, and effortless to apply in under 10 minutes.
        </p>

        <div style="background-color: #fdf2f8; border-left: 4px solid #ec4899; padding: 14px 18px; border-radius: 6px; margin: 24px 0;">
          <h4 style="color: #9d174d; margin: 0 0 8px 0; font-size: 15px;">What makes our press-on nails special?</h4>
          <ul style="color: #831843; font-size: 14px; margin: 0; padding-left: 18px; line-height: 1.6;">
            <li>✨ 100% Handcrafted with premium gel polishes</li>
            <li>💅 Reusable up to 5+ times with proper nail care</li>
            <li>📦 Complete prep kit included with every set (glue, tabs, buffer)</li>
            <li>🚚 Free Shipping on all orders above ₹${process.env.FREE_SHIPPING_ABOVE || '499'}</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${siteUrl}/shop" 
             style="background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);">
            Explore Nail Collections →
          </a>
        </div>

        <p style="color: #6b7280; font-size: 14px; line-height: 1.5;">
          Need custom sizes or want your dream design brought to life? You can also submit a <strong>Custom Order</strong> directly from your account anytime!
        </p>
      </div>

      <div style="border-top: 1px solid #f3f4f6; padding-top: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
        <p style="margin: 0 0 6px 0;">Need help? Chat with us on WhatsApp: ${process.env.BUSINESS_WHATSAPP || '+917081200263'}</p>
        <p style="margin: 0;">© ${new Date().getFullYear()} ${businessName}. All rights reserved.</p>
      </div>
    </div>
  `;

  await sendEmail({
    to: user.email,
    subject,
    html,
    from: `${businessName} <no-reply@polishedbyanshika.in>`,
  });
};

// ─── 2. Order Confirmation Email ─────────────────────────────────────────────
const sendOrderConfirmationEmail = async (order, user) => {
  const businessName = process.env.BUSINESS_NAME || 'PolishedByAnshika';
  const subject = `Order Confirmation #${order.orderNumber} — ${businessName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 8px;">
      <h2 style="color: #ec4899; text-align: center;">💅 Thank You For Your Order!</h2>
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>We've received your order <strong>#${order.orderNumber}</strong>. Your handmade press-on nails will be crafted with care.</p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      
      <h3 style="color: #333;">Order Summary:</h3>
      <ul style="list-style: none; padding-left: 0;">
        ${order.orderItems.map(item => `
          <li style="padding: 8px 0; border-bottom: 1px solid #fafafa; display: flex; justify-content: space-between;">
            <span>${item.name} (Qty: ${item.quantity})</span>
            <strong>₹${item.price * item.quantity}</strong>
          </li>
        `).join('')}
      </ul>
      
      <p style="font-size: 18px; margin-top: 15px;">
        <strong>Total Amount:</strong> <span style="color: #ec4899; font-weight: bold;">₹${order.totalPrice}</span>
      </p>
      
      <div style="background: #fdf2f8; padding: 12px; border-radius: 6px; margin: 20px 0;">
        <p style="margin: 0; color: #9d174d; font-size: 14px;">
          📦 <strong>Next Step:</strong> You will receive another notification as soon as your package is dispatched with tracking information.
        </p>
      </div>
      
      <p style="font-size: 12px; color: #888; text-align: center; margin-top: 30px;">
        ${businessName} • Handmade Luxury Press-On Nails
      </p>
    </div>
  `;
  await sendEmail({
    to: user.email,
    subject,
    html,
    from: `${businessName} <orders@polishedbyanshika.in>`,
  });
};

// ─── 3. Order Status Update Email ────────────────────────────────────────────
const sendOrderStatusUpdateEmail = async (order, user) => {
  const businessName = process.env.BUSINESS_NAME || 'PolishedByAnshika';
  const subject = `Order #${order.orderNumber} Status Updated: ${order.orderStatus}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 8px;">
      <h2 style="color: #ec4899; text-align: center;">📦 Order Status Update</h2>
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>Your order <strong>#${order.orderNumber}</strong> has been updated to:</p>
      
      <div style="background: #f3e8ff; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0;">
        <span style="font-size: 20px; font-weight: bold; color: #7e22ce; text-transform: uppercase;">
          ${order.orderStatus}
        </span>
      </div>
      
      <p>You can track the live status anytime on our website:</p>
      <p style="text-align: center;">
        <a href="${process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',')[0] : 'https://polishedbyanshika.in'}/order/${order._id}" 
           style="background: #ec4899; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
          Track My Order
        </a>
      </p>
      
      <p style="font-size: 12px; color: #888; text-align: center; margin-top: 30px;">
        ${businessName} • Handmade Luxury Press-On Nails
      </p>
    </div>
  `;
  await sendEmail({
    to: user.email,
    subject,
    html,
    from: `${businessName} <orders@polishedbyanshika.in>`,
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
};
