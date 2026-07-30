const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
  if (process.env.RESEND_API_KEY) {
    // Basic implementation for Resend, though the user asked to use nodemailer fallback primarily for now
    try {
      const { Resend } = require('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      const data = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to,
        subject,
        html,
      });
      console.log('Email sent via Resend:', data);
      return data;
    } catch (error) {
      console.error('Error sending email via Resend, falling back to Nodemailer:', error);
    }
  }

  // Nodemailer fallback
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Polished By Anshika" <no-reply@example.com>',
      to,
      subject,
      html,
    });

    console.log('Message sent via Nodemailer: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email via Nodemailer:', error);
    // console.log fallback
    console.log(`Fallback: Email to ${to}, Subject: ${subject}`);
    console.log(`Content: ${html}`);
  }
};

module.exports = { sendEmail };
