import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

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
      await resend.emails.send({
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
      await resend.emails.send({
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
};
