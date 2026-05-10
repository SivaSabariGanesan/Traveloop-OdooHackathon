# Email Setup Guide - Gmail Configuration

**For:** giridharan91507@gmail.com  
**Purpose:** Send real verification and password reset emails

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Enable 2-Step Verification

1. Go to your Google Account: https://myaccount.google.com/security
2. Click on **"2-Step Verification"**
3. Follow the prompts to enable it (you'll need your phone)
4. ✅ Once enabled, you can proceed to Step 2

---

### Step 2: Generate App Password

1. Go to: https://myaccount.google.com/apppasswords
2. You might need to sign in again
3. In the "Select app" dropdown, choose **"Mail"**
4. In the "Select device" dropdown, choose **"Other (Custom name)"**
5. Type: **"Traveloop Backend"**
6. Click **"Generate"**
7. **Copy the 16-character password** (it looks like: `abcd efgh ijkl mnop`)
8. ⚠️ **Important:** Save this password - you won't see it again!

---

### Step 3: Update .env File

Open `backend/.env` and update these lines:

```env
# Email Configuration
EMAIL_USER=giridharan91507@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop  # Paste your 16-character App Password (remove spaces)
APP_NAME=Traveloop
FRONTEND_URL=http://localhost:5173
```

**Important:** 
- Remove all spaces from the App Password
- Use the App Password, NOT your regular Gmail password
- Keep this file secure and never commit it to git

---

### Step 4: Restart the Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
bun run dev
```

---

## 🧪 Test Email Sending

### Test 1: Register with Your Email

```bash
POST http://localhost:5000/api/auth/register

{
  "firstName": "Giridharan",
  "lastName": "Test",
  "email": "giridharan91507@gmail.com",
  "password": "TestPass123!"
}
```

**Expected:**
- ✅ Registration successful
- ✅ Email sent to giridharan91507@gmail.com
- ✅ Check your inbox (and spam folder)

---

### Test 2: Check Your Email

Look for an email with:
- **Subject:** "Verify Your Email Address"
- **From:** "Traveloop <giridharan91507@gmail.com>"
- **Content:** Beautiful HTML email with verification button

---

### Test 3: Click Verification Link

The email will contain:
- A blue "Verify Email Address" button
- A verification URL you can copy/paste
- The link expires in 24 hours

---

## 📧 Email Templates

### Verification Email Preview:
```
Subject: Verify Your Email Address

Hi Giridharan!

Welcome to Traveloop! 🎉

Thank you for registering with us. To complete your registration 
and verify your email address, please click the button below:

[Verify Email Address Button]

⏰ This link will expire in 24 hours.
```

### Password Reset Email Preview:
```
Subject: Reset Your Password

Hi Giridharan!

🔐 Password Reset Request

We received a request to reset your password for your Traveloop account.

[Reset Password Button]

⏰ This link will expire in 1 hour.
```

---

## 🐛 Troubleshooting

### Issue: "Invalid login: 535-5.7.8 Username and Password not accepted"

**Solution:** You're using your regular Gmail password instead of the App Password.
- Generate a new App Password (Step 2)
- Update `.env` with the App Password

---

### Issue: "Error: Missing credentials for 'PLAIN'"

**Solution:** EMAIL_USER or EMAIL_PASSWORD is not set in `.env`
- Check that both variables are set
- Restart the server after updating `.env`

---

### Issue: Email not received

**Check:**
1. ✅ Spam/Junk folder
2. ✅ Server logs show "✅ Verification email sent to..."
3. ✅ EMAIL_USER matches the recipient email
4. ✅ App Password is correct (no spaces)

---

### Issue: "Less secure app access"

**Solution:** This is outdated. Use App Passwords instead (Step 2).
- App Passwords work even with 2-Step Verification
- More secure than "less secure app access"

---

## 🔒 Security Notes

### ✅ DO:
- Use App Passwords (not regular password)
- Keep `.env` file secure
- Add `.env` to `.gitignore`
- Enable 2-Step Verification

### ❌ DON'T:
- Commit `.env` to git
- Share your App Password
- Use regular Gmail password
- Disable 2-Step Verification

---

## 📝 Alternative: Using a Different Email Service

If you prefer not to use Gmail, here are alternatives:

### SendGrid (Recommended for Production)
- Free tier: 100 emails/day
- Setup: https://sendgrid.com
- More reliable for production

### Mailgun
- Free tier: 5,000 emails/month
- Setup: https://www.mailgun.com

### AWS SES
- Very cheap ($0.10 per 1,000 emails)
- Requires AWS account

---

## ✅ Verification Checklist

- [ ] 2-Step Verification enabled on Google Account
- [ ] App Password generated
- [ ] `.env` file updated with EMAIL_USER and EMAIL_PASSWORD
- [ ] Server restarted
- [ ] Test registration completed
- [ ] Email received in inbox
- [ ] Verification link works

---

## 🎉 Ready to Test!

Once you've completed the setup:

1. **Register:** Use your email in Swagger UI
2. **Check Email:** Look for verification email
3. **Click Link:** Verify your email address
4. **Success:** Email verified! ✅

---

**Need Help?** 
- Check server logs for error messages
- Verify App Password is correct
- Make sure 2-Step Verification is enabled
- Check spam folder for emails

---

**Status:** Ready for configuration! 🚀
