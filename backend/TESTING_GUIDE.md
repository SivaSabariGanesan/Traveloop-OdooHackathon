# 🧪 Testing Guide - Quick Start

## Overview

This project uses **manual testing via Swagger UI** for comprehensive API testing. All test cases are documented in the `tests/` folder.

---

## 📁 Test Structure

```
tests/
├── README.md              # Complete testing guide
├── auth.test.md          # Authentication tests (50+ cases) ✅
├── trip.test.md          # Trip management tests (45+ cases) ✅
├── itinerary.test.md     # Itinerary tests (pending) 🚧
├── checklist.test.md     # Checklist tests (pending) 🚧
└── notes.test.md         # Notes tests (pending) 🚧
```

---

## 🚀 Quick Start (5 Minutes)

### 1. Start Server
```bash
cd backend
bun run dev
```

### 2. Open Swagger UI
Navigate to: **http://localhost:5000/api-docs**

### 3. Run Basic Smoke Test

#### Step 1: Register User
1. Find `POST /api/auth/register` endpoint
2. Click "Try it out"
3. Use this test data:
```json
{
  "firstName": "Test",
  "lastName": "User",
  "email": "test@example.com",
  "password": "SecurePass123!"
}
```
4. Click "Execute"
5. Verify: Status 201, response has `accessToken`

#### Step 2: Authorize
1. Copy the `accessToken` from response
2. Click "Authorize" button (top right)
3. Enter: `Bearer YOUR_ACCESS_TOKEN`
4. Click "Authorize"

#### Step 3: Create Trip
1. Find `POST /api/trips` endpoint
2. Click "Try it out"
3. Use this test data:
```json
{
  "name": "Test Trip",
  "startDate": "2026-07-01",
  "endDate": "2026-07-15"
}
```
4. Click "Execute"
5. Verify: Status 201, trip created

#### Step 4: Get Trips
1. Find `GET /api/trips` endpoint
2. Click "Try it out"
3. Click "Execute"
4. Verify: Your trip appears in the response

✅ **If all 4 steps pass, your API is working!**

---

## 📋 Full Testing (2-3 Hours)

### Phase 1: Authentication (30 minutes)
Open: `tests/auth.test.md`

**Test Suites:**
1. User Registration (8 tests)
2. User Login (6 tests)
3. Token Refresh (5 tests)
4. Get Profile (4 tests)
5. Update Profile (6 tests)
6. Delete Account (3 tests)
7. Security Tests (5 tests)
8. Edge Cases (4 tests)

**Total:** 50+ test cases

### Phase 2: Trip Management (45 minutes)
Open: `tests/trip.test.md`

**Test Suites:**
1. Create Trip (10 tests)
2. Get All Trips (4 tests)
3. Get Single Trip (5 tests)
4. Update Trip (9 tests)
5. Delete Trip (5 tests)
6. Status Logic (6 tests)
7. Data Validation (4 tests)
8. Performance (3 tests)
9. Integration (2 tests)

**Total:** 45+ test cases

### Phase 3: Additional Features (Coming Soon)
- Itinerary Management
- Checklist Management
- Notes Management

---

## 🎯 Test Categories

### ✅ Positive Tests (Happy Path)
Tests that should succeed with valid inputs.

**Example:**
```
Test: Create trip with valid data
Expected: Status 201, trip created
```

### ❌ Negative Tests (Error Cases)
Tests that should fail with invalid inputs.

**Example:**
```
Test: Create trip without authentication
Expected: Status 401, error message
```

### 🔒 Security Tests
Tests for authentication, authorization, and security vulnerabilities.

**Example:**
```
Test: Rate limiting on login
Expected: 429 after 5 attempts
```

### 🏃 Performance Tests
Tests for response times and handling large datasets.

**Example:**
```
Test: Create 50 trips
Expected: All succeed, GET returns all in <2s
```

---

## 📊 Test Execution Template

Use this template to track your testing:

```markdown
## Test Session

**Date:** ___________
**Tester:** ___________
**Version:** ___________
**Environment:** Development

### Results

| Feature | Tests Run | Passed | Failed | Time |
|---------|-----------|--------|--------|------|
| Auth | 50 | | | |
| Trips | 45 | | | |
| Total | 95 | | | |

### Issues Found
1. 
2. 
3. 

### Notes
- 
- 

**Overall Status:** ☐ Pass ☐ Fail
```

---

## 🐛 Common Issues & Solutions

### Issue: "Authentication failed"
**Solution:** 
1. Check if you clicked "Authorize"
2. Verify token format: `Bearer YOUR_TOKEN`
3. Check if token expired (15 minutes)
4. Get new token by logging in again

### Issue: "Too many requests" (429)
**Solution:**
- Rate limit triggered (5 attempts per 15 min)
- Wait 15 minutes or restart server (dev only)

### Issue: "Email already registered"
**Solution:**
- Use different email for each test
- Or delete user and try again

### Issue: "Trip not found" (404)
**Solution:**
- Verify trip ID is correct
- Check if trip belongs to current user
- Verify trip wasn't deleted

### Issue: Server not responding
**Solution:**
```bash
# Check if server is running
curl http://localhost:5000/health

# Restart server
bun run dev
```

---

## 🔍 Debugging Tips

### 1. Check Server Logs
Server logs show detailed error information:
```bash
# Watch logs in real-time
bun run dev
# Errors appear in console
```

### 2. Verify Database State
```bash
# Open Prisma Studio
bun run prisma

# Check users, trips, etc.
```

### 3. Test with cURL
```bash
# Test endpoint directly
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"SecurePass123!"}'
```

### 4. Check Environment Variables
```bash
# Verify .env file exists
cat .env

# Check required variables
echo $JWT_SECRET
```

---

## 📈 Test Metrics

Track these during testing:

### Coverage
- **Total Tests:** 95+ (currently)
- **Executed:** ___
- **Passed:** ___
- **Failed:** ___
- **Coverage:** ___%

### Quality
- **Critical Bugs:** ___
- **High Priority:** ___
- **Medium Priority:** ___
- **Low Priority:** ___

### Performance
- **Avg Response Time:** ___ms
- **Slowest Endpoint:** ___
- **Failed Requests:** ___

---

## 🎓 Best Practices

### 1. Test in Order
- Some tests depend on previous ones
- Follow the order in test files
- Complete setup steps first

### 2. Use Unique Data
- Use different emails for each test run
- Avoid reusing test data
- Clean up after testing

### 3. Verify Everything
- Check status codes
- Verify response structure
- Check database state
- Confirm error messages

### 4. Document Issues
- Record all failures
- Include steps to reproduce
- Note expected vs actual results
- Add screenshots if helpful

### 5. Test Security
- Always test without authentication
- Try to access other users' data
- Test rate limiting
- Verify input validation

---

## 🚦 Test Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Test passed |
| ❌ | Test failed |
| 🚧 | Not implemented yet |
| ⚠️ | Passed with warnings |
| 🔒 | Security test |
| 🏃 | Performance test |

---

## 📞 Getting Help

### Documentation
1. [tests/README.md](./tests/README.md) - Complete testing guide
2. [tests/auth.test.md](./tests/auth.test.md) - Auth test cases
3. [tests/trip.test.md](./tests/trip.test.md) - Trip test cases
4. [API_OVERVIEW.md](./API_OVERVIEW.md) - API architecture
5. [SECURITY_FIXES.md](./SECURITY_FIXES.md) - Security documentation

### Quick Links
- **Swagger UI:** http://localhost:5000/api-docs
- **Health Check:** http://localhost:5000/health
- **API Docs JSON:** http://localhost:5000/api-docs.json

### Support
- Check server logs for errors
- Review test file comments
- Consult Swagger documentation
- Check database with Prisma Studio

---

## ✅ Testing Checklist

### Before Testing
- [ ] Server running (`bun run dev`)
- [ ] Database connected
- [ ] Swagger UI accessible
- [ ] .env configured
- [ ] Test files reviewed

### During Testing
- [ ] Follow test order
- [ ] Record all results
- [ ] Note unexpected behavior
- [ ] Check server logs
- [ ] Verify database state

### After Testing
- [ ] All tests documented
- [ ] Issues reported
- [ ] Test data cleaned
- [ ] Summary created
- [ ] Team notified

---

## 🎯 Next Steps

1. **Complete Current Tests**
   - Run all auth tests
   - Run all trip tests
   - Document results

2. **Implement Pending Features**
   - Itinerary management
   - Checklist management
   - Notes management

3. **Add Automated Tests**
   - Unit tests (Jest/Vitest)
   - Integration tests
   - E2E tests

4. **Continuous Testing**
   - Run tests after each change
   - Regression testing
   - Performance monitoring

---

**Last Updated:** 2026-05-10  
**Version:** 1.0.0  
**Status:** Ready for Testing

---

## 📚 Additional Resources

- [Swagger Documentation](https://swagger.io/docs/)
- [REST API Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://httpstatuses.com/)
- [JWT.io](https://jwt.io/) - JWT debugger
