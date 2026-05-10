# 🔐 Authentication System - Manual Test Cases

**Test Environment:** Swagger UI at `http://localhost:5000/api-docs`

**Prerequisites:**
- Server running: `bun run dev`
- Database connected and migrated
- Swagger UI accessible

---

## Test Suite 1: User Registration
### ✅ Test 1.1: Successful Registration
**Endpoint:** `POST /api/auth/register`

**Test Data:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@test.com",
  "password": "SecurePass123!",
  "phone": "+1234567890",
  "city": "New York",
  "country": "USA"
}
```

**Expected Result:**
- Status: `201 Created`
- Response contains:
  - `user` object (without password)
  - `accessToken` (JWT)
  - `refreshToken` (JWT)
- User created in database

**Verification:**
- [ ] Status code is 201
- [ ] Response has `status: "success"`
- [ ] User object contains: id, firstName, lastName, email, role
- [ ] User object does NOT contain password
- [ ] accessToken is a valid JWT
- [ ] refreshToken is a valid JWT
- [ ] role is "USER" by default

---

### ❌ Test 1.2: Registration with Weak Password
**Endpoint:** `POST /api/auth/register`

**Test Data:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@test.com",
  "password": "weak"
}
```

**Expected Result:**
- Status: `400 Bad Request`
- Error message about password requirements

**Verification:**
- [ ] Status code is 400
- [ ] Error mentions password requirements
- [ ] User NOT created in database

---

### ❌ Test 1.3: Registration with Missing Uppercase
**Test Data:**
```json
{
  "firstName": "Test",
  "lastName": "User",
  "email": "test1@test.com",
  "password": "lowercase123!"
}
```

**Expected Result:**
- Status: `400 Bad Request`
- Error: "Password must contain at least one uppercase letter"

**Verification:**
- [ ] Status code is 400
- [ ] Specific error about uppercase requirement

---

### ❌ Test 1.4: Registration with Missing Number
**Test Data:**
```json
{
  "firstName": "Test",
  "lastName": "User",
  "email": "test2@test.com",
  "password": "NoNumbers!"
}
```

**Expected Result:**
- Status: `400 Bad Request`
- Error: "Password must contain at least one number"

---

### ❌ Test 1.5: Registration with Missing Special Character
**Test Data:**
```json
{
  "firstName": "Test",
  "lastName": "User",
  "email": "test3@test.com",
  "password": "NoSpecial123"
}
```

**Expected Result:**
- Status: `400 Bad Request`
- Error: "Password must contain at least one special character"

---

### ❌ Test 1.6: Registration with Duplicate Email
**Test Data:**
```json
{
  "firstName": "Duplicate",
  "lastName": "User",
  "email": "john.doe@test.com",
  "password": "SecurePass123!"
}
```

**Expected Result:**
- Status: `409 Conflict`
- Error: "Email already registered"

**Verification:**
- [ ] Status code is 409
- [ ] Error message is clear
- [ ] No duplicate user created

---

### ❌ Test 1.7: Registration with Invalid Email
**Test Data:**
```json
{
  "firstName": "Invalid",
  "lastName": "Email",
  "email": "not-an-email",
  "password": "SecurePass123!"
}
```

**Expected Result:**
- Status: `400 Bad Request`
- Error: "Invalid email address"

---

### ❌ Test 1.8: Registration with Missing Required Fields
**Test Data:**
```json
{
  "email": "missing@test.com",
  "password": "SecurePass123!"
}
```

**Expected Result:**
- Status: `400 Bad Request`
- Errors for missing firstName and lastName

---

### 🔒 Test 1.9: Rate Limiting on Registration
**Steps:**
1. Make 5 registration attempts with different emails
2. Make a 6th attempt

**Expected Result:**
- First 5 attempts: Normal responses (201 or 400)
- 6th attempt: Status `429 Too Many Requests`
- Error: "Too many authentication attempts"

**Verification:**
- [ ] Rate limit triggers after 5 attempts
- [ ] Status code is 429
- [ ] Clear error message
- [ ] Wait 15 minutes and try again (should work)

---

## Test Suite 2: User Login

### ✅ Test 2.1: Successful Login
**Endpoint:** `POST /api/auth/login`

**Prerequisites:** User from Test 1.1 exists

**Test Data:**
```json
{
  "email": "john.doe@test.com",
  "password": "SecurePass123!"
}
```

**Expected Result:**
- Status: `200 OK`
- Response contains:
  - `user` object (without password)
  - `accessToken`
  - `refreshToken`

**Verification:**
- [ ] Status code is 200
- [ ] User object matches registered user
- [ ] Password NOT in response
- [ ] Tokens are valid JWTs
- [ ] Can decode accessToken to see user id and role

---

### ❌ Test 2.2: Login with Wrong Password
**Test Data:**
```json
{
  "email": "john.doe@test.com",
  "password": "WrongPassword123!"
}
```

**Expected Result:**
- Status: `401 Unauthorized`
- Error: "Invalid credentials"

**Verification:**
- [ ] Status code is 401
- [ ] Generic error message (doesn't reveal if email exists)
- [ ] No tokens returned

---

### ❌ Test 2.3: Login with Non-existent Email
**Test Data:**
```json
{
  "email": "nonexistent@test.com",
  "password": "SecurePass123!"
}
```

**Expected Result:**
- Status: `401 Unauthorized`
- Error: "Invalid credentials"

**Verification:**
- [ ] Status code is 401
- [ ] Same error message as wrong password (prevents email enumeration)
- [ ] Response time similar to wrong password (timing attack protection)

---

### ❌ Test 2.4: Login with Invalid Email Format
**Test Data:**
```json
{
  "email": "not-an-email",
  "password": "SecurePass123!"
}
```

**Expected Result:**
- Status: `400 Bad Request`
- Error: "Invalid email address"

---

### ❌ Test 2.5: Login with Missing Password
**Test Data:**
```json
{
  "email": "john.doe@test.com"
}
```

**Expected Result:**
- Status: `400 Bad Request`
- Error: "Password is required"

---

### 🔒 Test 2.6: Rate Limiting on Login
**Steps:**
1. Make 5 failed login attempts
2. Make a 6th attempt

**Expected Result:**
- First 5 attempts: Status 401
- 6th attempt: Status `429 Too Many Requests`

**Verification:**
- [ ] Rate limit triggers after 5 attempts
- [ ] Status code is 429
- [ ] Error message about too many attempts
- [ ] Even correct credentials blocked after rate limit

---

## Test Suite 3: Token Refresh

### ✅ Test 3.1: Successful Token Refresh
**Endpoint:** `POST /api/auth/refresh`

**Prerequisites:** 
- Login first to get refresh token
- Copy the refreshToken from login response

**Test Data:**
```json
{
  "refreshToken": "YOUR_REFRESH_TOKEN_FROM_LOGIN"
}
```

**Expected Result:**
- Status: `200 OK`
- Response contains new `accessToken`
- New token is different from original

**Verification:**
- [ ] Status code is 200
- [ ] New accessToken returned
- [ ] New token is valid JWT
- [ ] Can use new token for authenticated requests

---

### ❌ Test 3.2: Refresh with Invalid Token
**Test Data:**
```json
{
  "refreshToken": "invalid.token.here"
}
```

**Expected Result:**
- Status: `401 Unauthorized`
- Error: "Invalid or expired refresh token"

---

### ❌ Test 3.3: Refresh with Expired Token
**Prerequisites:** Wait for refresh token to expire (7 days by default)

**Expected Result:**
- Status: `401 Unauthorized`
- Error: "Invalid or expired refresh token"

---

### ❌ Test 3.4: Refresh with Access Token (Wrong Token Type)
**Test Data:**
```json
{
  "refreshToken": "YOUR_ACCESS_TOKEN"
}
```

**Expected Result:**
- Status: `401 Unauthorized`
- Error: "Invalid or expired refresh token"

---

### ❌ Test 3.5: Refresh for Deleted User
**Steps:**
1. Login and get refresh token
2. Delete the user account
3. Try to refresh token

**Expected Result:**
- Status: `401 Unauthorized`
- Error: "User not found"

---

## Test Suite 4: Get User Profile

### ✅ Test 4.1: Get Profile with Valid Token
**Endpoint:** `GET /api/users/me`

**Prerequisites:** 
- Login to get access token
- Click "Authorize" in Swagger
- Enter: `Bearer YOUR_ACCESS_TOKEN`

**Expected Result:**
- Status: `200 OK`
- Response contains user object
- Password NOT included

**Verification:**
- [ ] Status code is 200
- [ ] User data matches registered user
- [ ] Password field not present
- [ ] All profile fields returned (firstName, lastName, email, etc.)

---

### ❌ Test 4.2: Get Profile without Token
**Steps:**
1. Click "Authorize" and clear the token
2. Try to get profile

**Expected Result:**
- Status: `401 Unauthorized`
- Error: "Authentication failed"

---

### ❌ Test 4.3: Get Profile with Invalid Token
**Steps:**
1. Click "Authorize"
2. Enter: `Bearer invalid.token.here`
3. Try to get profile

**Expected Result:**
- Status: `401 Unauthorized`
- Error: "Authentication failed"

---

### ❌ Test 4.4: Get Profile with Expired Token
**Prerequisites:** Wait for access token to expire (15 minutes by default)

**Expected Result:**
- Status: `401 Unauthorized`
- Error: "Authentication failed"

**Note:** Use refresh token to get new access token

---

## Test Suite 5: Update User Profile

### ✅ Test 5.1: Update Profile Successfully
**Endpoint:** `PATCH /api/users/me`

**Prerequisites:** Authenticated with valid token

**Test Data:**
```json
{
  "firstName": "John Updated",
  "city": "Los Angeles",
  "phone": "+9876543210"
}
```

**Expected Result:**
- Status: `200 OK`
- Response contains updated user object
- Only specified fields updated

**Verification:**
- [ ] Status code is 200
- [ ] firstName changed to "John Updated"
- [ ] city changed to "Los Angeles"
- [ ] phone changed to "+9876543210"
- [ ] Other fields unchanged (lastName, email, etc.)
- [ ] Password still not in response

---

### ✅ Test 5.2: Update Single Field
**Test Data:**
```json
{
  "country": "Canada"
}
```

**Expected Result:**
- Status: `200 OK`
- Only country field updated

---

### ❌ Test 5.3: Update with Invalid Data
**Test Data:**
```json
{
  "firstName": "<script>alert('xss')</script>"
}
```

**Expected Result:**
- Status: `400 Bad Request`
- Error: "First name contains invalid characters"

---

### ❌ Test 5.4: Update with Empty Required Field
**Test Data:**
```json
{
  "firstName": ""
}
```

**Expected Result:**
- Status: `400 Bad Request`
- Error: "First name cannot be empty"

---

### ❌ Test 5.5: Update without Authentication
**Steps:**
1. Clear authorization token
2. Try to update profile

**Expected Result:**
- Status: `401 Unauthorized`

---

### ❌ Test 5.6: Update with Too Long Values
**Test Data:**
```json
{
  "firstName": "A".repeat(100)
}
```

**Expected Result:**
- Status: `400 Bad Request`
- Error: "First name must not exceed 50 characters"

---

## Test Suite 6: Delete User Account

### ✅ Test 6.1: Delete Account Successfully
**Endpoint:** `DELETE /api/users/me`

**Prerequisites:** 
- Create a new test user
- Login with that user
- Use their access token

**Expected Result:**
- Status: `200 OK`
- Success message
- User deleted from database

**Verification:**
- [ ] Status code is 200
- [ ] Success message returned
- [ ] Cannot login with deleted user credentials
- [ ] User not found in database
- [ ] Related data handled (trips cascade deleted)

---

### ❌ Test 6.2: Delete without Authentication
**Steps:**
1. Clear authorization token
2. Try to delete account

**Expected Result:**
- Status: `401 Unauthorized`

---

### ❌ Test 6.3: Use Token After Account Deletion
**Steps:**
1. Delete account (keep the access token)
2. Try to get profile with old token

**Expected Result:**
- Status: `404 Not Found`
- Error: "User not found"

---

## Test Suite 7: Security Tests

### 🔒 Test 7.1: CORS Protection
**Manual Test (using browser console or Postman):**

```javascript
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Origin': 'https://evil.com'
  },
  body: JSON.stringify({
    email: 'john.doe@test.com',
    password: 'SecurePass123!'
  })
})
```

**Expected Result:**
- CORS error if origin not in ALLOWED_ORIGINS

---

### 🔒 Test 7.2: JWT Token Tampering
**Steps:**
1. Get valid access token
2. Modify the payload (change user id)
3. Try to use modified token

**Expected Result:**
- Status: `401 Unauthorized`
- Error: "Authentication failed"

---

### 🔒 Test 7.3: SQL Injection Attempt
**Test Data:**
```json
{
  "email": "admin@test.com' OR '1'='1",
  "password": "anything"
}
```

**Expected Result:**
- Status: `401 Unauthorized`
- No SQL injection (Prisma protects)

---

### 🔒 Test 7.4: XSS Attempt in Registration
**Test Data:**
```json
{
  "firstName": "<script>alert('XSS')</script>",
  "lastName": "Test",
  "email": "xss@test.com",
  "password": "SecurePass123!"
}
```

**Expected Result:**
- Status: `400 Bad Request`
- Error: "First name contains invalid characters"

---

### 🔒 Test 7.5: Password Not Returned in Any Response
**Steps:**
1. Register user
2. Login
3. Get profile
4. Update profile

**Verification:**
- [ ] Password never appears in any response
- [ ] Check all response bodies
- [ ] Check error responses

---

## Test Suite 8: Edge Cases

### Test 8.1: Very Long Email
**Test Data:**
```json
{
  "firstName": "Test",
  "lastName": "User",
  "email": "a".repeat(100) + "@test.com",
  "password": "SecurePass123!"
}
```

**Expected Result:**
- Should handle gracefully (accept or reject with clear error)

---

### Test 8.2: Unicode Characters in Name
**Test Data:**
```json
{
  "firstName": "José",
  "lastName": "García",
  "email": "jose@test.com",
  "password": "SecurePass123!"
}
```

**Expected Result:**
- Status: `201 Created`
- Unicode characters preserved

---

### Test 8.3: Whitespace in Fields
**Test Data:**
```json
{
  "firstName": "  John  ",
  "lastName": "  Doe  ",
  "email": "  john@test.com  ",
  "password": "SecurePass123!"
}
```

**Expected Result:**
- Status: `201 Created`
- Whitespace trimmed automatically

---

### Test 8.4: Case Sensitivity in Email
**Steps:**
1. Register with: john@test.com
2. Try to login with: JOHN@TEST.COM

**Expected Result:**
- Login successful (email normalized to lowercase)

---

## Test Execution Checklist

### Before Testing:
- [ ] Server is running
- [ ] Database is connected
- [ ] Swagger UI is accessible
- [ ] .env file configured correctly
- [ ] JWT secrets are set (32+ characters)

### During Testing:
- [ ] Test in order (some tests depend on previous ones)
- [ ] Record actual results
- [ ] Note any unexpected behavior
- [ ] Check server logs for errors
- [ ] Verify database state after operations

### After Testing:
- [ ] All tests passed
- [ ] No security vulnerabilities found
- [ ] Performance is acceptable
- [ ] Error messages are clear
- [ ] Documentation matches behavior

---

## Test Results Template

```
Test Date: ___________
Tester: ___________
Environment: ___________

| Test ID | Test Name | Status | Notes |
|---------|-----------|--------|-------|
| 1.1 | Successful Registration | ☐ Pass ☐ Fail | |
| 1.2 | Weak Password | ☐ Pass ☐ Fail | |
| ... | ... | ... | |

Issues Found:
1. 
2. 
3. 

Overall Status: ☐ All Pass ☐ Some Failures ☐ Blocked
```

---

## Common Issues & Solutions

### Issue: Rate limit not working
**Solution:** Check if express-rate-limit is installed and middleware is applied

### Issue: CORS errors in Swagger
**Solution:** Swagger UI runs from same origin, should work. Check browser console.

### Issue: JWT tokens not working
**Solution:** Verify JWT_SECRET is set and at least 32 characters

### Issue: Password validation not working
**Solution:** Check Zod schema in validators/auth.validator.ts

---

**Last Updated:** 2026-05-10  
**Version:** 1.0.0  
**Status:** Ready for Testing
