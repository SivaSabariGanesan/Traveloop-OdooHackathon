# 🧪 Manual Testing Guide

This folder contains comprehensive manual test cases for all API features. These tests are designed to be executed in Swagger UI.

---

## 📁 Test Files

| File | Feature | Status | Test Count |
|------|---------|--------|------------|
| [auth.test.md](./auth.test.md) | Authentication System | ✅ Complete | 50+ tests |
| [trip.test.md](./trip.test.md) | Trip Management | ✅ Complete | 45+ tests |
| itinerary.test.md | Itinerary/Sections | 🚧 Pending | - |
| checklist.test.md | Checklist Items | 🚧 Pending | - |
| notes.test.md | Trip Notes | 🚧 Pending | - |

---

## 🚀 Quick Start

### 1. Start the Server
```bash
cd backend
bun run dev
```

### 2. Open Swagger UI
Navigate to: `http://localhost:5000/api-docs`

### 3. Run Tests
Follow the test cases in each `.test.md` file in order.

---

## 📋 Testing Workflow

### Step 1: Authentication Setup
1. Open [auth.test.md](./auth.test.md)
2. Run Test Suite 1 (Registration)
3. Run Test Suite 2 (Login)
4. Copy the `accessToken` from login response
5. Click "Authorize" button in Swagger UI
6. Enter: `Bearer YOUR_ACCESS_TOKEN`

### Step 2: Feature Testing
1. Choose a feature to test (e.g., Trip Management)
2. Open corresponding test file (e.g., [trip.test.md](./trip.test.md))
3. Execute tests in order
4. Record results in the template provided

### Step 3: Record Results
Each test file has a results template at the bottom. Use it to track:
- Test execution date
- Pass/Fail status
- Issues found
- Notes

---

## 🎯 Test Categories

### ✅ Positive Tests (Happy Path)
- Valid inputs
- Expected successful outcomes
- Verify correct data returned

### ❌ Negative Tests (Error Cases)
- Invalid inputs
- Missing required fields
- Unauthorized access
- Verify proper error handling

### 🔒 Security Tests
- Authentication/Authorization
- Rate limiting
- CORS protection
- Input sanitization
- SQL injection prevention
- XSS prevention

### 🏃 Performance Tests
- Response times
- Large datasets
- Concurrent requests

### 🔄 Integration Tests
- Complete workflows
- Multi-user scenarios
- Data consistency

---

## 📊 Test Coverage

### Authentication (auth.test.md)
- ✅ User Registration (8 tests)
- ✅ User Login (6 tests)
- ✅ Token Refresh (5 tests)
- ✅ Get Profile (4 tests)
- ✅ Update Profile (6 tests)
- ✅ Delete Account (3 tests)
- ✅ Security Tests (5 tests)
- ✅ Edge Cases (4 tests)

**Total:** 50+ test cases

### Trip Management (trip.test.md)
- ✅ Create Trip (10 tests)
- ✅ Get All Trips (4 tests)
- ✅ Get Single Trip (5 tests)
- ✅ Update Trip (9 tests)
- ✅ Delete Trip (5 tests)
- ✅ Status Logic (6 tests)
- ✅ Data Validation (4 tests)
- ✅ Performance (3 tests)
- ✅ Integration (2 tests)

**Total:** 45+ test cases

---

## 🛠️ Testing Tools

### Primary: Swagger UI
- **URL:** http://localhost:5000/api-docs
- **Pros:** 
  - Interactive
  - Built-in authorization
  - Request/response visualization
  - No additional setup
- **Use for:** All manual testing

### Alternative: Postman
- **Use for:** 
  - Automated test collections
  - Environment variables
  - Test scripts
- **Setup:** Import OpenAPI spec from `/api-docs.json`

### Alternative: cURL
- **Use for:**
  - Quick command-line tests
  - CI/CD integration
  - Scripting
- **Examples provided in:** Each test file

---

## 📝 Test Execution Guidelines

### Before Testing
1. ✅ Server is running
2. ✅ Database is connected and migrated
3. ✅ Environment variables configured
4. ✅ Swagger UI accessible
5. ✅ Test data prepared

### During Testing
1. ✅ Follow test order (dependencies exist)
2. ✅ Record actual results
3. ✅ Note unexpected behavior
4. ✅ Check server logs for errors
5. ✅ Verify database state after operations
6. ✅ Test both success and failure cases

### After Testing
1. ✅ All tests documented
2. ✅ Issues logged
3. ✅ Test results saved
4. ✅ Database cleaned (if needed)
5. ✅ Summary report created

---

## 🐛 Issue Reporting Template

When you find an issue during testing:

```markdown
## Issue #X: [Brief Description]

**Test Case:** [Test ID from test file]
**Severity:** Critical / High / Medium / Low
**Status:** Open / In Progress / Resolved

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happened]

**Screenshots/Logs:**
[Attach if available]

**Environment:**
- OS: 
- Browser: 
- Server Version: 
- Database: 

**Additional Notes:**
[Any other relevant information]
```

---

## 📈 Test Metrics

Track these metrics during testing:

### Coverage
- Total test cases: ___
- Tests executed: ___
- Tests passed: ___
- Tests failed: ___
- Tests skipped: ___
- Coverage %: ___

### Quality
- Critical bugs: ___
- High priority bugs: ___
- Medium priority bugs: ___
- Low priority bugs: ___

### Performance
- Average response time: ___ms
- Slowest endpoint: ___
- Failed requests: ___

---

## 🔄 Regression Testing

After any code changes, run:

### Quick Smoke Test (15 minutes)
1. Register new user
2. Login
3. Create trip
4. Get trips
5. Update trip
6. Delete trip

### Full Regression (2-3 hours)
1. All auth tests
2. All trip tests
3. All integration tests

---

## 🎓 Best Practices

### 1. Test Data Management
- Use unique emails for each test run
- Clean up test data after testing
- Don't use production data
- Use realistic but fake data

### 2. Test Independence
- Each test should be independent
- Don't rely on previous test state
- Clean up after each test suite

### 3. Error Verification
- Always check status codes
- Verify error messages
- Check error response format
- Ensure no sensitive data in errors

### 4. Security Testing
- Test authentication on all endpoints
- Verify authorization rules
- Test rate limiting
- Check for data leakage

### 5. Documentation
- Record all test results
- Document issues clearly
- Note any deviations from expected behavior
- Keep test files updated

---

## 🚦 Test Status Indicators

| Symbol | Meaning |
|--------|---------|
| ✅ | Test passed |
| ❌ | Test failed |
| 🚧 | Test pending/not implemented |
| ⚠️ | Test passed with warnings |
| 🔒 | Security test |
| 🏃 | Performance test |
| 🔄 | Integration test |

---

## 📞 Support

### Questions?
- Check test file comments
- Review Swagger documentation
- Check server logs
- Consult API_OVERVIEW.md

### Found a Bug?
1. Verify it's reproducible
2. Check if it's already reported
3. Create detailed issue report
4. Notify development team

---

## 🔮 Future Test Files

### Coming Soon:

#### itinerary.test.md
- Section CRUD operations
- Activity management
- Ordering and organization
- Nested data handling

#### checklist.test.md
- Checklist item creation
- Mark as complete/incomplete
- Categories and priorities
- Bulk operations

#### notes.test.md
- Note creation and editing
- Rich text support
- Attachments
- Sharing and permissions

---

## 📊 Test Execution Log

```
Date: ___________
Tester: ___________
Version: ___________

| Feature | Tests Run | Passed | Failed | Time |
|---------|-----------|--------|--------|------|
| Auth | | | | |
| Trips | | | | |
| Itinerary | | | | |
| Checklist | | | | |
| Notes | | | | |

Total Time: ___________
Overall Status: ☐ Pass ☐ Fail
```

---

## 🎯 Testing Checklist

### Pre-Testing
- [ ] Environment setup complete
- [ ] Test data prepared
- [ ] Documentation reviewed
- [ ] Tools ready (Swagger UI)

### Testing
- [ ] Authentication tests complete
- [ ] Trip management tests complete
- [ ] Itinerary tests complete
- [ ] Checklist tests complete
- [ ] Notes tests complete
- [ ] Security tests complete
- [ ] Performance tests complete
- [ ] Integration tests complete

### Post-Testing
- [ ] All results documented
- [ ] Issues reported
- [ ] Test data cleaned
- [ ] Summary report created
- [ ] Stakeholders notified

---

**Last Updated:** 2026-05-10  
**Version:** 1.0.0  
**Maintained by:** Backend Team

---

## 📚 Additional Resources

- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [API Documentation](../API_OVERVIEW.md)
- [Security Fixes](../SECURITY_FIXES.md)
- [Setup Guide](../SETUP.md)
