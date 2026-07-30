const sendEmail = async ({ to, subject, html }) => {
  try {
    if (process.env.RESEND_API_KEY) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'PolishedByAnshika <noreply@polishedbyanshika.com>',
          to,
          subject,
          html,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error sending email with Resend:', errorData);
      }
    } else {
      console.log('--- EMAIL MOCK ---');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`HTML: ${html}`);
      console.log('------------------');
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

const sendOrderConfirmationEmail = async (order, user) => {
  const subject = `Order Confirmation - ${order.orderNumber}`;
  const html = `
    <h1>Thank you for your order, ${user.name}!</h1>
    <p>We've received your order <strong>#${order.orderNumber}</strong> and it is now being processed.</p>
    <h2>Order Summary:</h2>
    <ul>
      ${order.orderItems.map(item => `<li>${item.name} - ${item.quantity} x ₹${item.price}</li>`).join('')}
    </ul>
    <p><strong>Total:</strong> ₹${order.totalPrice}</p>
    <p>We will notify you when your order is shipped.</p>
  `;
  await sendEmail({ to: user.email, subject, html });
};

const sendOrderStatusUpdateEmail = async (order, user) => {
  const subject = `Order Status Update - ${order.orderNumber}`;
  const html = `
    <h1>Order Update</h1>
    <p>Hi ${user.name}, the status of your order <strong>#${order.orderNumber}</strong> has been updated.</p>
    <p><strong>New Status:</strong> ${order.orderStatus}</p>
    <p>Thank you for shopping with us!</p>
  `;
  await sendEmail({ to: user.email, subject, html });
};

module.exports = { sendEmail, sendOrderConfirmationEmail, sendOrderStatusUpdateEmail };
