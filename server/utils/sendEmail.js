const sendEmail = async ({ to, subject, html }) => {
  try {
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_demo') {
      const fromEmail = process.env.FROM_EMAIL || 'orders@polishedbyanshika.in';
      const businessName = process.env.BUSINESS_NAME || 'PolishedByAnshika';

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${businessName} <${fromEmail}>`,
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

const sendOrderConfirmationEmail = async (order, user) => {
  const subject = `Order Confirmation #${order.orderNumber} — ${process.env.BUSINESS_NAME || 'PolishedByAnshika'}`;
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
        ${process.env.BUSINESS_NAME || 'PolishedByAnshika'} • Handmade Luxury Press-On Nails
      </p>
    </div>
  `;
  await sendEmail({ to: user.email, subject, html });
};

const sendOrderStatusUpdateEmail = async (order, user) => {
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
        ${process.env.BUSINESS_NAME || 'PolishedByAnshika'} • Handmade Luxury Press-On Nails
      </p>
    </div>
  `;
  await sendEmail({ to: user.email, subject, html });
};

module.exports = { sendEmail, sendOrderConfirmationEmail, sendOrderStatusUpdateEmail };
