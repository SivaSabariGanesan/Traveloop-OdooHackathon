import { Resend } from 'resend';

// Lazy-load Resend client to ensure environment variables are loaded
let resend: Resend | null = null;

const getResendClient = (): Resend => {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('❌ RESEND_API_KEY is not set in environment variables');
      throw new Error('RESEND_API_KEY environment variable is required');
    }
    resend = new Resend(apiKey);
  }
  return resend;
};

export const emailService = {
  /**
   * Send email verification email
   */
  sendVerificationEmail: async (
    email: string,
    token: string,
    firstName: string
  ): Promise<void> => {
    // In production, this should be your frontend URL
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;

    try {
      await getResendClient().emails.send({
        from: 'Traveloop <onboarding@resend.dev>',
        to: email,
        subject: 'Verify Your Email Address',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
              .token { background: #e8e8e8; padding: 10px; border-radius: 5px; font-family: monospace; word-break: break-all; margin: 15px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to ${process.env.APP_NAME || 'Traveloop'}! 🎉</h1>
              </div>
              <div class="content">
                <h2>Hi ${firstName}!</h2>
                <p>Thank you for registering with us. We're excited to have you on board!</p>
                <p>To complete your registration and verify your email address, please click the button below:</p>
                
                <div style="text-align: center;">
                  <a href="${verificationUrl}" class="button">Verify Email Address</a>
                </div>
                
                <p>Or copy and paste this link into your browser:</p>
                <div class="token">${verificationUrl}</div>
                
                <p><strong>⏰ This link will expire in 24 hours.</strong></p>
                
                <p>If you didn't create an account with us, please ignore this email.</p>
                
                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                
                <p style="color: #666; font-size: 14px;">
                  <strong>Security Note:</strong> We will never ask for your password via email.
                </p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} ${process.env.APP_NAME || 'Traveloop'}. All rights reserved.</p>
                <p>This is an automated email. Please do not reply.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });
      
      console.log(`✅ Verification email sent to ${email}`);
    } catch (error) {
      console.error('❌ Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  },

  /**
   * Send password reset email
   */
  sendPasswordResetEmail: async (
    email: string,
    token: string,
    firstName: string
  ): Promise<void> => {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

    try {
      await getResendClient().emails.send({
        from: 'Traveloop <onboarding@resend.dev>',
        to: email,
        subject: 'Reset Your Password',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; padding: 15px 30px; background: #f5576c; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
              .token { background: #e8e8e8; padding: 10px; border-radius: 5px; font-family: monospace; word-break: break-all; margin: 15px 0; }
              .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔐 Password Reset Request</h1>
              </div>
              <div class="content">
                <h2>Hi ${firstName}!</h2>
                <p>We received a request to reset your password for your ${process.env.APP_NAME || 'Traveloop'} account.</p>
                
                <div class="warning">
                  <strong>⚠️ Important:</strong> If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
                </div>
                
                <p>To reset your password, click the button below:</p>
                
                <div style="text-align: center;">
                  <a href="${resetUrl}" class="button">Reset Password</a>
                </div>
                
                <p>Or copy and paste this link into your browser:</p>
                <div class="token">${resetUrl}</div>
                
                <p><strong>⏰ This link will expire in 1 hour.</strong></p>
                
                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                
                <p style="color: #666; font-size: 14px;">
                  <strong>Security Tips:</strong>
                  <ul style="color: #666; font-size: 14px;">
                    <li>Never share your password with anyone</li>
                    <li>Use a strong, unique password</li>
                    <li>Enable two-factor authentication if available</li>
                  </ul>
                </p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} ${process.env.APP_NAME || 'Traveloop'}. All rights reserved.</p>
                <p>This is an automated email. Please do not reply.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });
      
      console.log(`✅ Password reset email sent to ${email}`);
    } catch (error) {
      console.error('❌ Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  },

  /**
   * Send invoice as PDF attachment
   */
  sendInvoice: async (
    to: string,
    tripName: string,
    pdfBuffer: Buffer
  ): Promise<void> => {
    try {
      await getResendClient().emails.send({
        from: 'Traveloop <onboarding@resend.dev>',
        to,
        subject: `Your Travelloop Invoice — ${tripName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8"/>
            <style>
              body { margin:0; padding:0; background:#f8fafc; font-family:'Segoe UI',sans-serif; }
              .wrapper { max-width:520px; margin:40px auto; }
              .header { background:linear-gradient(135deg,#2563eb,#1d4ed8); border-radius:16px 16px 0 0; padding:36px 40px; text-align:center; }
              .header-title { color:#fff; font-size:24px; font-weight:700; margin:0; }
              .header-sub { color:#bfdbfe; font-size:14px; margin-top:6px; }
              .body { background:#ffffff; padding:36px 40px; border-radius:0 0 16px 16px; }
              .greeting { font-size:16px; color:#0f172a; margin-bottom:16px; }
              .info-box { background:#f1f5f9; border-radius:10px; padding:20px 24px; margin:20px 0; }
              .info-row { display:flex; justify-content:space-between; font-size:14px; margin-bottom:8px; color:#475569; }
              .info-row:last-child { margin-bottom:0; }
              .info-row span:last-child { font-weight:600; color:#0f172a; }
              .note { font-size:13px; color:#64748b; margin-top:20px; line-height:1.6; }
              .footer { text-align:center; margin-top:28px; font-size:12px; color:#94a3b8; }
              .brand { color:#2563eb; font-weight:600; }
            </style>
          </head>
          <body>
            <div class="wrapper">
              <div class="header">
                <p class="header-title">✈ Your Trip Invoice</p>
                <p class="header-sub">Travelloop — Travel smarter</p>
              </div>
              <div class="body">
                <p class="greeting">Hi there,</p>
                <p style="font-size:14px;color:#475569;line-height:1.7">
                  Your invoice for <strong style="color:#0f172a">${tripName}</strong> is attached
                  to this email as a PDF. You can download, print, or save it for your records.
                </p>
                <div class="info-box">
                  <div class="info-row">
                    <span>📄 Document Type</span>
                    <span>Trip Invoice</span>
                  </div>
                  <div class="info-row">
                    <span>🗓 Trip</span>
                    <span>${tripName}</span>
                  </div>
                  <div class="info-row">
                    <span>📎 Format</span>
                    <span>PDF</span>
                  </div>
                </div>
                <p class="note">
                  If you have any questions about this invoice or need assistance, feel free to reach out to our support team.
                </p>
                <p class="note">
                  Thank you for using <span class="brand">Travelloop</span>!
                </p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} Travelloop. All rights reserved.</p>
                <p>This is an automated email. Please do not reply.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        attachments: [
          {
            filename: `invoice-${tripName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`,
            content: pdfBuffer,
          },
        ],
      });

      console.log(`✅ Invoice email sent to ${to}`);
    } catch (error) {
      console.error('❌ Error sending invoice email:', error);
      throw new Error('Failed to send invoice email');
    }
  },
};
