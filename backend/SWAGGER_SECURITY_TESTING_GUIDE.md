# Swagger Security Testing Guide

**Server URL:** http://localhost:5000  
**Swagger UI:** http://localhost:5000/api-docs  
**Date:** May 10, 2026

---

## 🚀 Quick Start

1. **Open Swagger UI:** http://localhost:5000/api-docs
2. **Server is running on:** http://localhost:5000
3. **Follow the test scenarios below**

---

## 📋 Test Scenarios

### Test 1: Password Change Endpoint

#### Prerequisites:
First, you need to register and login to get an access token.

#### Step 1: Register a Test User
1. Find **POST /api/auth/register** in Swagger
2. Click "Try it out"
3. Use this payload:
```json
{
  "firstName": "Test",
  "lastName": "User",
  "email": "testuser@example.com",
  "password": "OldPassword123!",
  "phone": "+1234567890",
  "city": "New York",
  "country": "USA"
}
```
4. Click "Execute"
5. **Copy the `accessToken`** from the response

#### Step 2: Test Password Change
1. Find **PATCH /api/auth/change-password** in Swagger
2. Click "Try it out"
3. Click the 🔒 **Authorize** button at the top
4. Enter: `Bearer <your_access_token>` (replace with token from Step 1)
5. Click "Authorize" then "Close"
6. Use this payload:
```json
{
  "oldPassword": "OldPassword123!",
  "newPassword": "NewSecurePass456!"
}
```
7. Click "Execute"
8. **Expected Result:** 200 OK with success message

#### Step 3: Test Password Change Validations

**Test 3a: Wrong Old Password**
```json
{
  "oldPassword": "WrongPassword123!",
  "newPassword": "NewSecurePass456!"
}
```
**Expected:** 401 Unauthorized - "Current password is incorrect"

**Test 3b: Weak New Password**
```json
{
  "oldPassword": "NewSecurePass456!",
  "newPassword": "weak"
}
```
**Expected:** 400 Bad Request - Password validation errors

**Test 3c: Same Old and New Password**
```json
{
  "oldPassword": "NewSecurePass456!",
  "newPassword": "NewSecurePass456!"
}
```
**Expected:** 400 Bad Request - "New password must be different from current password"

**Test 3d: Missing Special Character**
```json
{
  "oldPassword": "NewSecurePass456!",
  "newPassword": "NoSpecialChar123"
}
```
**Expected:** 400 Bad Request - "Password must contain at least one special character"

---

### Test 2: Forgot Password Flow

#### Step 1: Request Password Reset
1. Find **POST /api/auth/forgot-password** in Swagger
2. Click "Try it out"
3. Use this payload:
```json
{
  "email": "testuser@example.com"
}
```
4. Click "Execute"
5. **Copy the `resetToken`** from the response (only available in development mode)
6. **Expected Result:** 200 OK with success message

#### Step 2: Test Email Enumeration Prevention
Try with a non-existent email:
```json
{
  "email": "nonexistent@example.com"
}
```
**Expected:** Same 200 OK response (prevents email enumeration)

#### Step 3: Reset Password with Token
1. Find **POST /api/auth/reset-password** in Swagger
2. Click "Try it out"
3. Use this payload (with token from Step 1):
```json
{
  "token": "<paste_reset_token_here>",
  "newPassword": "ResetPassword789!"
}
```
4. Click "Execute"
5. **Expected Result:** 200 OK - "Password reset successfully"

#### Step 4: Verify Password Was Reset
1. Find **POST /api/auth/login** in Swagger
2. Try logging in with the new password:
```json
{
  "email": "testuser@example.com",
  "password": "ResetPassword789!"
}
```
3. **Expected Result:** 200 OK with new access token

#### Step 5: Test Token Expiration
1. Wait for 1 hour (or modify the expiration in code for testing)
2. Try to use the same reset token again
3. **Expected:** 400 Bad Request - "Invalid or expired reset token"

#### Step 6: Test Token Reuse Prevention
1. Request a new reset token
2. Use it to reset password successfully
3. Try to use the same token again
4. **Expected:** 400 Bad Request - "Invalid or expired reset token"

---

### Test 3: Rate Limiting

#### Test Login Rate Limiting
1. Find **POST /api/auth/login** in Swagger
2. Try to login with wrong credentials 6 times in a row:
```json
{
  "email": "testuser@example.com",
  "password": "WrongPassword123!"
}
```
3. **Expected:** After 5 attempts, you should get:
   - Status: 429 Too Many Requests
   - Message: "Too many login attempts, please try again after 15 minutes"

#### Test Forgot Password Rate Limiting
1. Find **POST /api/auth/forgot-password** in Swagger
2. Try to request password reset 6 times in a row
3. **Expected:** After 5 attempts, you should get:
   - Status: 429 Too Many Requests
   - Message: "Too many authentication attempts from this IP, please try again after 15 minutes"

---

### Test 4: JWT Secret Validation

This test verifies that the server fails to start without JWT secrets.

#### Test Server Startup Without Secrets
1. Stop the server
2. Rename `.env` to `.env.backup`
3. Try to start the server
4. **Expected:** Server should fail with error:
   ```
   FATAL: JWT_SECRET environment variable is not defined. Application cannot start.
   ```
5. Restore `.env` file

---

### Test 5: Bcrypt Cost Factor

This test verifies the password hashing strength.

#### Test Registration Performance
1. Find **POST /api/auth/register** in Swagger
2. Register a new user and measure response time
3. **Expected:** Response time should be ~50-100ms (includes bcrypt hashing)

#### Verify in Code
Check `backend/src/utils/hash.ts`:
```typescript
const BCRYPT_ROUNDS = 12; // Should be 12, not 10
```

---

## 🔍 Additional Security Tests

### Test 6: Strong Password Validation

Try registering with various weak passwords:

**Missing Uppercase:**
```json
{
  "firstName": "Test",
  "lastName": "User",
  "email": "test1@example.com",
  "password": "lowercase123!"
}
```
**Expected:** 400 - "Password must contain at least one uppercase letter"

**Missing Lowercase:**
```json
{
  "firstName": "Test",
  "lastName": "User",
  "email": "test2@example.com",
  "password": "UPPERCASE123!"
}
```
**Expected:** 400 - "Password must contain at least one lowercase letter"

**Missing Number:**
```json
{
  "firstName": "Test",
  "lastName": "User",
  "email": "test3@example.com",
  "password": "NoNumbers!"
}
```
**Expected:** 400 - "Password must contain at least one number"

**Missing Special Character:**
```json
{
  "firstName": "Test",
  "lastName": "User",
  "email": "test4@example.com",
  "password": "NoSpecial123"
}
```
**Expected:** 400 - "Password must contain at least one special character"

**Too Short:**
```json
{
  "firstName": "Test",
  "lastName": "User",
  "email": "test5@example.com",
  "password": "Short1!"
}
```
**Expected:** 400 - "Password must be at least 8 characters"

---

## 📊 Test Results Checklist

Use this checklist to track your testing:

### Password Change Endpoint
- [ ] ✅ Successfully change password with valid credentials
- [ ] ✅ Reject wrong old password
- [ ] ✅ Reject weak new password
- [ ] ✅ Reject same old and new password
- [ ] ✅ Require authentication (401 without token)
- [ ] ✅ Validate password complexity

### Forgot/Reset Password Flow
- [ ] ✅ Request reset token successfully
- [ ] ✅ Prevent email enumeration (same response for non-existent emails)
- [ ] ✅ Reset password with valid token
- [ ] ✅ Reject expired token (after 1 hour)
- [ ] ✅ Reject reused token
- [ ] ✅ Reject invalid token
- [ ] ✅ Verify password was actually changed

### Rate Limiting
- [ ] ✅ Block after 5 login attempts
- [ ] ✅ Block after 5 forgot-password attempts
- [ ] ✅ Block after 5 register attempts
- [ ] ✅ Return 429 status code
- [ ] ✅ Return appropriate error message

### JWT Secret Validation
- [ ] ✅ Server fails to start without JWT_SECRET
- [ ] ✅ Server fails to start without JWT_REFRESH_SECRET
- [ ] ✅ Clear error messages displayed

### Bcrypt Cost Factor
- [ ] ✅ Cost factor is 12 (check code)
- [ ] ✅ Registration takes ~50-100ms
- [ ] ✅ Login takes ~50-100ms

### Password Validation
- [ ] ✅ Reject password without uppercase
- [ ] ✅ Reject password without lowercase
- [ ] ✅ Reject password without number
- [ ] ✅ Reject password without special character
- [ ] ✅ Reject password shorter than 8 characters
- [ ] ✅ Reject password longer than 128 characters

---

## 🎯 Quick Test Script

For rapid testing, use these curl commands:

### 1. Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "testuser@example.com",
    "password": "OldPassword123!"
  }'
```

### 2. Change Password
```bash
# Save token from register response
TOKEN="<your_access_token>"

curl -X PATCH http://localhost:5000/api/auth/change-password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "OldPassword123!",
    "newPassword": "NewSecurePass456!"
  }'
```

### 3. Forgot Password
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com"
  }'
```

### 4. Reset Password
```bash
# Save resetToken from forgot-password response
RESET_TOKEN="<your_reset_token>"

curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "'$RESET_TOKEN'",
    "newPassword": "ResetPassword789!"
  }'
```

---

## 🐛 Troubleshooting

### Issue: "Unauthorized" error
**Solution:** Make sure you're using the Authorize button in Swagger and entering `Bearer <token>`

### Issue: Rate limiting blocking tests
**Solution:** Wait 15 minutes or restart the server to reset rate limits

### Issue: Reset token not in response
**Solution:** Check that `NODE_ENV=development` in your `.env` file

### Issue: Server won't start
**Solution:** Check that all required environment variables are set in `.env`

---

## 📝 Notes

- **Development Mode:** Reset tokens are included in the response for testing
- **Production Mode:** Reset tokens should only be sent via email
- **Rate Limits:** 5 attempts per 15 minutes per IP
- **Token Expiration:** Reset tokens expire after 1 hour
- **Password Requirements:** 8+ chars, uppercase, lowercase, number, special character

---

## ✅ Success Criteria

All tests should pass with:
- ✅ Proper status codes (200, 400, 401, 429)
- ✅ Clear error messages
- ✅ Security features working as expected
- ✅ No sensitive data leaked in responses
- ✅ Rate limiting preventing abuse
- ✅ Strong password enforcement
- ✅ Token-based password reset working

---

**Happy Testing! 🎉**
