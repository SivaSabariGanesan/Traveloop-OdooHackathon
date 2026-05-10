# Email Verification - Quick Test Card

**Swagger UI:** http://localhost:5000/api-docs  
**Status:** ✅ Ready to Test

---

## 🚀 3-Minute Test

### Step 1: Register (30 seconds)
**Endpoint:** POST /api/auth/register

```json
{
  "firstName": "Test",
  "lastName": "User",
  "email": "test@example.com",
  "password": "TestPass123!"
}
```

**Copy from response:**
- ✅ `accessToken`
- ✅ `verificationToken`

---

### Step 2: Check Unverified (30 seconds)
**Endpoint:** GET /api/users/me

1. Click 🔒 **Authorize**
2. Enter: `Bearer <your_access_token>`
3. Execute

**Expected:** `emailVerified: false`

---

### Step 3: Verify Email (30 seconds)
**Endpoint:** POST /api/auth/verify-email

```json
{
  "token": "<paste_verification_token>"
}
```

**Expected:** "Email verified successfully"

---

### Step 4: Confirm Verified (30 seconds)
**Endpoint:** GET /api/users/me

**Expected:** `emailVerified: true`

---

## ✅ Success!

If all 4 steps passed, email verification is working! 🎉

---

## 🧪 Bonus Tests

### Test Resend:
**Endpoint:** POST /api/auth/resend-verification
```json
{ "email": "test@example.com" }
```

### Test Invalid Token:
**Endpoint:** POST /api/auth/verify-email
```json
{ "token": "invalid123" }
```
**Expected:** 400 Bad Request

### Test Rate Limiting:
Send 6 resend requests rapidly
**Expected:** 5th succeeds, 6th returns 429

---

## 📚 Full Documentation

- **Implementation:** `EMAIL_VERIFICATION_IMPLEMENTATION.md`
- **Full Testing:** `EMAIL_VERIFICATION_SWAGGER_TEST.md`
- **Summary:** `HIGH_PRIORITY_EMAIL_VERIFICATION_COMPLETE.md`

---

**Ready? Open Swagger and test!** 🚀
