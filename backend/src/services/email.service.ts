import nodemailer from 'nodemailer';

const createTransport = () => {
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  });
};

const getFrom = () =>
  process.env.EMAIL_FROM || process.env.GMAIL_USER || process.env.SMTP_USER || 'noreply@traveloop.com';

const appName = () => process.env.APP_NAME || 'Traveloop';

export const emailService = {
  sendOtpEmail: async (email: string, otp: string, firstName: string): Promise<void> => {
    const name = appName();
    const transporter = createTransport();

    await transporter.sendMail({
      from: `${name} <${getFrom()}>`,
      to: email,
      subject: `${otp} is your ${name} verification code`,
      html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8">
<style>
  body{font-family:Arial,sans-serif;background:#FAF6F0;margin:0;padding:0}
  .wrap{max-width:480px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(198,93,58,.10)}
  .header{background:linear-gradient(135deg,#C65D3A 0%,#D4A373 100%);padding:32px;text-align:center}
  .header h1{color:#fff;margin:0;font-size:22px;font-weight:700}
  .body{padding:36px 32px;text-align:center}
  .body p{color:#5a4a3a;font-size:15px;line-height:1.6;margin:0 0 20px}
  .otp{font-size:44px;font-weight:800;letter-spacing:14px;color:#C65D3A;background:#FFF3EE;border-radius:12px;padding:20px 32px;display:inline-block;margin:8px 0 24px}
  .note{font-size:13px;color:#9a8070}
  .footer{background:#F5EDE4;padding:16px 32px;text-align:center;font-size:12px;color:#9a8070}
</style>
</head>
<body>
<div class="wrap">
  <div class="header"><h1>✈️ ${name}</h1></div>
  <div class="body">
    <p>Hi ${firstName}! Enter this code to verify your account:</p>
    <div class="otp">${otp}</div>
    <p class="note">⏰ Expires in <strong>10 minutes</strong>. Don't share this code with anyone.</p>
  </div>
  <div class="footer">© ${new Date().getFullYear()} ${name}. All rights reserved.</div>
</div>
</body>
</html>`,
    });

    console.log(`✅ OTP email sent to ${email}`);
  },

  sendPasswordResetEmail: async (email: string, otp: string, firstName: string): Promise<void> => {
    const name = appName();
    const transporter = createTransport();

    await transporter.sendMail({
      from: `${name} <${getFrom()}>`,
      to: email,
      subject: `${otp} is your ${name} password reset code`,
      html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8">
<style>
  body{font-family:Arial,sans-serif;background:#FAF6F0;margin:0;padding:0}
  .wrap{max-width:480px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden}
  .header{background:linear-gradient(135deg,#C65D3A 0%,#D4A373 100%);padding:32px;text-align:center}
  .header h1{color:#fff;margin:0;font-size:22px;font-weight:700}
  .body{padding:36px 32px;text-align:center}
  .body p{color:#5a4a3a;font-size:15px;line-height:1.6;margin:0 0 20px}
  .otp{font-size:44px;font-weight:800;letter-spacing:14px;color:#C65D3A;background:#FFF3EE;border-radius:12px;padding:20px 32px;display:inline-block;margin:8px 0 24px}
  .note{font-size:13px;color:#9a8070}
  .footer{background:#F5EDE4;padding:16px 32px;text-align:center;font-size:12px;color:#9a8070}
</style>
</head>
<body>
<div class="wrap">
  <div class="header"><h1>🔐 ${name}</h1></div>
  <div class="body">
    <p>Hi ${firstName}! Use this code to reset your password:</p>
    <div class="otp">${otp}</div>
    <p class="note">⏰ Expires in <strong>10 minutes</strong>. If you didn't request this, ignore this email.</p>
  </div>
  <div class="footer">© ${new Date().getFullYear()} ${name}. All rights reserved.</div>
</div>
</body>
</html>`,
    });

    console.log(`✅ Password reset OTP sent to ${email}`);
  },
};
