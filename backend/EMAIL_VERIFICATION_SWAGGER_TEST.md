# Email Verification - Swagger Testing Guide

**Server:** http://localhost:5000  
**Swagger UI:** http://localhost:5000/api-docs  
**Status:** ✅ Ready to Test

---

## 🚀 Quick Test Flow

### Test 1: Complete Email Verification Flow

#### Step 1: Register New User
1. Open http://localhost:5000/api-docs
2. Find **POST /api/auth/register**
3. Click "Try it out"
4. Use this payload:

```json
{
  "firstName": "Email",
  "lastName": "Test",
  "email": "emailtest@example.com",
  "password": "TestPass123!",
  "phone": "+1234567890",
  "city": "New York",
  "country": "USA"
}
```

5. Click "Execute"
6. **IMPORTANT:** Copy the `verificationToken` from the response

**Expected Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "...",
      "firstName": "Email",
      "lastName": "Test",
      "email": "emailtest@example.com",
      "emailVerified": false,  // ← Should be false
      ...
    },
    "accessToken": "...",
    "refreshToken": "...",
    "message": "Registration successful. Please check your email to verify your account.",
    "verificationToken": "abc123..."  // ← Copy this token
  }
}
```

---

#### Step 2: Check Unverified Status
1. Copy the `accessToken` from Step 1
2. Find **GET /api/users/me**
3. Click the 🔒 **Authorize** button at the top
4. Enter: `Bearer <your_access_token>`
5. Click "Authorize" then "Close"
6. Click "Try it out" on GET /api/users/me
7. Click "Execute"

**Expected Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "emailVerified": false  // ← Should be false
    }
  }
}
```

---

#### Step 3: Verify Email
1. Find **POST /api/auth/verify-email**
2. Click "Try it out"
3. Paste the verification token from Step 1:

```json
{
  "token": "<paste_verification_token_here>"
}
```

4. Click "Execute"

**Expected Response:**
```json
{
  "status": "success",
  "data": {
    "message": "Email verified successfully"
  }
}
```

---

#### Step 4: Confirm Verified Status
1. Go back to **GET /api/users/me**
2. Click "Execute" again

**Expected Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "emailVerified": true  // ← Should now be true
    }
  }
}
```

✅ **Success!** Email verification is working!

---

### Test 2: Resend Verification Email

#### Step 1: Register Another User
1. Find **POST /api/auth/register**
2. Register with a different email:

```json
{
  "firstName": "Resend",
  "lastName": "Test",
  "email": "resendtest@example.com",
  "password": "TestPass123!"
}
```

3. **Don't verify yet** - we'll test the resend feature

---

#### Step 2: Request Resend
1. Find **POST /api/auth/resend-verification**
2. Click "Try it out"
3. Use this payload:

```json
{
  "email": "resendtest@example.com"
}
```

4. Click "Execute"

**Expected Response:**
```json
{
  "status": "success",
  "data": {
    "message": "If an account exists with this email, a verification link has been sent",
    "verificationToken": "new_token_here"  // ← Copy this new token
  }
}
```

---

#### Step 3: Verify with New Token
1. Find **POST /api/auth/verify-email**
2. Use the NEW token from Step 2:

```json
{
  "token": "<new_verification_token>"
}
```

3. Click "Execute"

**Expected Response:**
```json
{
  "status": "success",
  "data": {
    "message": "Email verified successfully"
  }
}
```

✅ **Success!** Resend verification is working!

---

### Test 3: Security Tests

#### Test 3a: Invalid Token
1. Find **POST /api/auth/verify-email**
2. Try with an invalid token:

```json
{
  "token": "invalid_token_12345"
}
```

**Expected:** 400 Bad Request
```json
{
  "status": "error",
  "message": "Invalid or expired verification token"
}
```

---

#### Test 3b: Already Verified
1. Use a token from a user you already verified
2. Try to verify again

**Expected:** 200 OK
```json
{
  "status": "success",
  "data": {
    "message": "Email already verified"
  }
}
```

---

#### Test 3c: Email Enumeration Prevention
1. Find **POST /api/auth/resend-verification**
2. Try with a non-existent email:

```json
{
  "email": "nonexistent@example.com"
}
```

**Expected:** Same 200 OK response (doesn't reveal if email exists)
```json
{
  "status": "success",
  "data": {
    "message": "If an account exists with this email, a verification link has been sent"
  }
}
```

---

#### Test 3d: Rate Limiting
1. Find **POST /api/auth/resend-verification**
2. Click "Execute" 6 times rapidly

**Expected:** After 5 attempts:
```json
{
  "status": "error",
  "message": "Too many authentication attempts from this IP, please try again after 15 minutes"
}
```

---

#### Test 3e: Resend for Already Verified User
1. Request resend for an already verified email
2. Find **POST /api/auth/resend-verification**

```json
{
  "email": "emailtest@example.com"
}
```

**Expected:** 200 OK
```json
{
  "status": "success",
  "data": {
    "message": "Email is already verified"
  }
}
```

---

## 📊 Test Results Checklist

Track your testing progress:

### Basic Flow
- [ ] ✅ Register user with `emailVerified: false`
- [ ] ✅ Verification token returned in response (dev mode)
- [ ] ✅ User profile shows `emailVerified: false`
- [ ] ✅ Verify email with token
- [ ] ✅ User profile shows `emailVerified: true`

### Resend Flow
- [ ] ✅ Request resend verification
- [ ] ✅ Receive new token
- [ ] ✅ Verify with new token
- [ ] ✅ Old token no longer works

### Security Tests
- [ ] ✅ Invalid token rejected (400)
- [ ] ✅ Already verified returns success (200)
- [ ] ✅ Email enumeration prevented (same response)
- [ ] ✅ Rate limiting blocks after 5 attempts (429)
- [ ] ✅ Resend for verified user returns appropriate message

### Token Security
- [ ] ✅ Token is cryptographically secure (32 bytes)
- [ ] ✅ Token is hashed before storage (SHA-256)
- [ ] ✅ Token expires after 24 hours
- [ ] ✅ Token cleared after successful verification

---

## 🎯 Quick cURL Commands

For command-line testing:

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Email",
    "lastName": "Test",
    "email": "emailtest@example.com",
    "password": "TestPass123!"
  }'
```

### Verify Email
```bash
# Save verificationToken from register response
TOKEN="<your_verification_token>"

curl -X POST http://localhost:5000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "token": "'$TOKEN'"
  }'
```

### Resend Verification
```bash
curl -X POST http://localhost:5000/api/auth/resend-verification \
  -H "Content-Type: application/json" \
  -d '{
    "email": "emailtest@example.com"
  }'
```

### Check Profile
```bash
# Save accessToken from register response
ACCESS_TOKEN="<your_access_token>"

curl -X GET http://localhost:5000/api/users/me \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

---

## 🐛 Troubleshooting

### Issue: No verification token in response
**Solution:** Check that `NODE_ENV=development` in `.env` file

### Issue: "Invalid or expired verification token"
**Possible causes:**
- Token was already used
- Token expired (24 hours)
- Token is invalid
- Database was reset

**Solution:** Request a new token via resend-verification

### Issue: Rate limiting blocking tests
**Solution:** Wait 15 minutes or restart the server

### Issue: emailVerified still false after verification
**Solution:** 
- Check that you used the correct token
- Verify the API returned success
- Try fetching profile again (might be cached)

---

## 📝 Notes

- **Development Mode:** Verification tokens are included in API responses for testing
- **Production Mode:** Tokens should only be sent via email (not in API response)
- **Token Expiration:** 24 hours (vs 1 hour for password reset)
- **Rate Limiting:** 5 attempts per 15 minutes per IP
- **Email Enumeration:** Prevented by returning same response for all emails

---

## ✅ Success Criteria

All tests should pass with:
- ✅ Users registered with `emailVerified: false`
- ✅ Verification tokens generated and returned (dev mode)
- ✅ Email verification working correctly
- ✅ Resend verification working
- ✅ Invalid tokens rejected
- ✅ Email enumeration prevented
- ✅ Rate limiting active
- ✅ Tokens expire after 24 hours
- ✅ Tokens cleared after use

---

## 🎉 Next Steps

After testing in Swagger:

1. **Integrate Email Service**
   - Choose provider (SendGrid, AWS SES, Mailgun)
   - Create email templates
   - Send actual verification emails

2. **Frontend Integration**
   - Create `/verify-email` page
   - Show "verify email" banner for unverified users
   - Add resend verification button

3. **Optional: Enforce Verification**
   - Add middleware to require verified email
   - Block certain actions for unverified users

---

**Ready to test!** Open http://localhost:5000/api-docs and follow the steps above. 🚀
