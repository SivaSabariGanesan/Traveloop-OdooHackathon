# Gmail Setup - Quick Reference

## 🚀 3 Steps to Enable Real Emails

### 1️⃣ Enable 2-Step Verification
**Link:** https://myaccount.google.com/security
- Click "2-Step Verification"
- Follow prompts (need phone)

### 2️⃣ Generate App Password
**Link:** https://myaccount.google.com/apppasswords
- Select app: **Mail**
- Select device: **Other** → Type "Traveloop Backend"
- Click **Generate**
- **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)

### 3️⃣ Update .env File
```env
EMAIL_USER=giridharan91507@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop  # Your App Password (no spaces)
APP_NAME=Traveloop
FRONTEND_URL=http://localhost:5173
```

### 4️⃣ Restart Server
```bash
# Stop server (Ctrl+C), then:
bun run dev
```

---

## 🧪 Test It!

### In Swagger UI:
```json
POST /api/auth/register
{
  "firstName": "Giridharan",
  "lastName": "Test",
  "email": "giridharan91507@gmail.com",
  "password": "TestPass123!"
}
```

### Check Your Email:
- Subject: "Verify Your Email Address"
- Beautiful HTML email with button
- Click to verify!

---

## ⚠️ Important Notes

- ✅ Use **App Password**, not regular Gmail password
- ✅ Remove spaces from App Password
- ✅ Check spam folder if email not in inbox
- ✅ Server logs will show: "✅ Verification email sent to..."

---

## 🐛 Quick Troubleshooting

**"Invalid login"** → Using regular password instead of App Password  
**"Missing credentials"** → .env not updated or server not restarted  
**No email received** → Check spam folder, verify EMAIL_USER is correct

---

**Ready?** Follow the 4 steps above and test! 🎉
