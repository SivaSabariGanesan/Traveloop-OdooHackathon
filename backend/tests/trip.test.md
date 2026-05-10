# 🗺️ Trip Management - Manual Test Cases

**Test Environment:** Swagger UI at `http://localhost:5000/api-docs`

**Prerequisites:**
- Server running: `bun run dev`
- User registered and logged in
- Access token obtained and set in Swagger Authorization

---

## Setup: Authentication

**Before running any trip tests:**
1. Register a user (see auth.test.md)
2. Login to get access token
3. Click "Authorize" in Swagger UI
4. Enter: `Bearer YOUR_ACCESS_TOKEN`

---

## Test Suite 1: Create Trip

### ✅ Test 1.1: Create Trip Successfully
**Endpoint:** `POST /api/trips`

**Test Data:**
```json
{
  "name": "Summer Vacation 2026",
  "startDate": "2026-07-01",
  "endDate": "2026-07-15",
  "description": "Two weeks in Europe",
  "placeId": "place_123",
  "coverPhoto": "https://example.com/photo.jpg"
}
```

**Expected Result:**
- Status: `201 Created`
- Response contains trip object with:
  - Generated `id`
  - `status: "UPCOMING"` (since dates are in future)
  - `userId` matches authenticated user
  - All provided fields
  - `createdAt` and `updatedAt` timestamps

**Verification:**
- [ ] Status code is 201
- [ ] Trip has unique ID
- [ ] Status is correctly calculated
- [ ] userId matches current user
- [ ] All fields present
- [ ] Timestamps are valid ISO dates

---

### ✅ Test 1.2: Create Trip with Minimal Data
**Test Data:**
```json
{
  "name": "Weekend Getaway",
  "startDate": "2026-06-01",
  "endDate": "2026-06-03"
}
```

**Expected Result:**
- Status: `201 Created`
- Optional fields are null/undefined
- Required fields present

**Verification:**
- [ ] Trip created successfully
- [ ] description is null
- [ ] placeId is null
- [ ] coverPhoto is null

---

### ✅ Test 1.3: Create ONGOING Trip
**Test Data:**
```json
{
  "name": "Current Trip",
  "startDate": "2026-05-01",
  "endDate": "2026-05-31",
  "description": "Trip happening now"
}
```

**Note:** Adjust dates so startDate is in past and endDate is in future

**Expected Result:**
- Status: `201 Created`
- `status: "ONGOING"`

**Verification:**
- [ ] Status is "ONGOING"
- [ ] Status calculated correctly based on dates

---

### ✅ Test 1.4: Create COMPLETED Trip
**Test Data:**
```json
{
  "name": "Past Trip",
  "startDate": "2026-01-01",
  "endDate": "2026-01-15",
  "description": "Trip that already happened"
}
```

**Note:** Adjust dates so both are in the past

**Expected Result:**
- Status: `201 Created`
- `status: "COMPLETED"`

---

### ❌ Test 1.5: Create Trip without Authentication
**Steps:**
1. Click "Authorize" and clear token
2. Try to create trip

**Expected Result:**
- Status: `401 Unauthorized`
- Error: "Authentication failed"

---

### ❌ Test 1.6: Create Trip with Missing Name
**Test Data:**
```json
{
  "startDate": "2026-07-01",
  "endDate": "2026-07-15"
}
```

**Expected Result:**
- Status: `400 Bad Request`
- Error: "Trip name is required"

---

### ❌ Test 1.7: Create Trip with Missing Dates
**Test Data:**
```json
{
  "name": "Incomplete Trip"
}
```

**Expected Result:**
- Status: `400 Bad Request`
- Errors for missing startDate and endDate

---

### ❌ Test 1.8: Create Trip with End Date Before Start Date
**Test Data:**
```json
{
  "name": "Invalid Dates",
  "startDate": "2026-07-15",
  "endDate": "2026-07-01"
}
```

**Expected Result:**
- Status: `400 Bad Request`
- Error: "End date must be after or equal to start date"

---

### ❌ Test 1.9: Create Trip with Invalid Date Format
**Test Data:**
```json
{
  "name": "Bad Date Format",
  "startDate": "01-07-2026",
  "endDate": "15-07-2026"
}
```

**Expected Result:**
- Status: `400 Bad Request`
- Error about invalid date format

---

### ❌ Test 1.10: Create Trip with Empty Name
**Test Data:**
```json
{
  "name": "",
  "startDate": "2026-07-01",
  "endDate": "2026-07-15"
}
```

**Expected Result:**
- Status: `400 Bad Request`
- Error: "Trip name is required"

---

## Test Suite 2: Get All Trips

### ✅ Test 2.1: Get All Trips (Empty List)
**Endpoint:** `GET /api/trips`

**Prerequisites:** New user with no trips

**Expected Result:**
- Status: `200 OK`
- Response structure:
```json
{
  "status": "success",
  "data": {
    "ongoing": [],
    "upcoming": [],
    "completed": []
  }
}
```

**Verification:**
- [ ] Status code is 200
- [ ] All three arrays present
- [ ] All arrays empty

---

### ✅ Test 2.2: Get All Trips (With Data)
**Prerequisites:** Create trips from Tests 1.1, 1.3, 1.4

**Expected Result:**
- Status: `200 OK`
- Trips grouped by status:
  - `ongoing`: Contains current trip
  - `upcoming`: Contains future trip
  - `completed`: Contains past trip

**Verification:**
- [ ] All created trips returned
- [ ] Trips correctly grouped by status
- [ ] Each trip has all fields
- [ ] Trips ordered by createdAt (newest first)

---

### ✅ Test 2.3: Get Trips Shows Only User's Trips
**Steps:**
1. Create trips with User A
2. Login as User B
3. Get trips for User B

**Expected Result:**
- Status: `200 OK`
- Only User B's trips returned
- User A's trips NOT visible

**Verification:**
- [ ] Data isolation working
- [ ] No cross-user data leakage

---

### ❌ Test 2.4: Get Trips without Authentication
**Steps:**
1. Clear authorization token
2. Try to get trips

**Expected Result:**
- Status: `401 Unauthorized`

---

## Test Suite 3: Get Single Trip

### ✅ Test 3.1: Get Trip by ID Successfully
**Endpoint:** `GET /api/trips/{id}`

**Prerequisites:** Create a trip and note its ID

**Test Data:**
- Path parameter: `{id}` = trip ID from Test 1.1

**Expected Result:**
- Status: `200 OK`
- Response contains complete trip object
- Includes nested sections and activities (if any)

**Verification:**
- [ ] Status code is 200
- [ ] Trip data matches created trip
- [ ] All fields present
- [ ] Nested relations included

---

### ❌ Test 3.2: Get Trip with Invalid ID
**Test Data:**
- Path parameter: `{id}` = "invalid-id-123"

**Expected Result:**
- Status: `404 Not Found`
- Error: "Trip not found"

---

### ❌ Test 3.3: Get Another User's Trip
**Steps:**
1. User A creates a trip (note the ID)
2. Login as User B
3. Try to get User A's trip by ID

**Expected Result:**
- Status: `403 Forbidden`
- Error: "Forbidden"

**Verification:**
- [ ] Cannot access other users' trips
- [ ] Authorization working correctly

---

### ❌ Test 3.4: Get Trip without Authentication
**Expected Result:**
- Status: `401 Unauthorized`

---

### ❌ Test 3.5: Get Deleted Trip
**Steps:**
1. Create a trip
2. Delete the trip
3. Try to get the deleted trip

**Expected Result:**
- Status: `404 Not Found`

---

## Test Suite 4: Update Trip

### ✅ Test 4.1: Update Trip Name
**Endpoint:** `PATCH /api/trips/{id}`

**Test Data:**
```json
{
  "name": "Updated Trip Name"
}
```

**Expected Result:**
- Status: `200 OK`
- Trip name updated
- Other fields unchanged
- `updatedAt` timestamp changed

**Verification:**
- [ ] Name updated successfully
- [ ] Other fields preserved
- [ ] updatedAt is newer than createdAt

---

### ✅ Test 4.2: Update Trip Description
**Test Data:**
```json
{
  "description": "Updated description with more details"
}
```

**Expected Result:**
- Status: `200 OK`
- Description updated
- Other fields unchanged

---

### ✅ Test 4.3: Update Trip Dates
**Test Data:**
```json
{
  "startDate": "2026-08-01",
  "endDate": "2026-08-15"
}
```

**Expected Result:**
- Status: `200 OK`
- Dates updated
- Status recalculated based on new dates

**Verification:**
- [ ] Dates updated
- [ ] Status recalculated correctly
- [ ] If dates change from future to past, status changes to COMPLETED

---

### ✅ Test 4.4: Update Multiple Fields
**Test Data:**
```json
{
  "name": "Completely Updated Trip",
  "description": "New description",
  "coverPhoto": "https://example.com/new-photo.jpg"
}
```

**Expected Result:**
- Status: `200 OK`
- All specified fields updated

---

### ❌ Test 4.5: Update with Invalid End Date
**Test Data:**
```json
{
  "startDate": "2026-08-15",
  "endDate": "2026-08-01"
}
```

**Expected Result:**
- Status: `400 Bad Request`
- Error: "End date must be after or equal to start date"

---

### ❌ Test 4.6: Update Another User's Trip
**Steps:**
1. User A creates a trip
2. Login as User B
3. Try to update User A's trip

**Expected Result:**
- Status: `403 Forbidden`

---

### ❌ Test 4.7: Update with Empty Name
**Test Data:**
```json
{
  "name": ""
}
```

**Expected Result:**
- Status: `400 Bad Request`
- Error about empty name

---

### ❌ Test 4.8: Update Non-existent Trip
**Test Data:**
- Path parameter: non-existent ID

**Expected Result:**
- Status: `404 Not Found`

---

### ❌ Test 4.9: Update without Authentication
**Expected Result:**
- Status: `401 Unauthorized`

---

## Test Suite 5: Delete Trip

### ✅ Test 5.1: Delete Trip Successfully
**Endpoint:** `DELETE /api/trips/{id}`

**Prerequisites:** Create a test trip

**Expected Result:**
- Status: `200 OK`
- Success message
- Trip deleted from database

**Verification:**
- [ ] Status code is 200
- [ ] Success message returned
- [ ] Trip no longer in GET /api/trips
- [ ] Cannot GET deleted trip by ID
- [ ] Related sections and activities also deleted (cascade)

---

### ❌ Test 5.2: Delete Another User's Trip
**Steps:**
1. User A creates a trip
2. Login as User B
3. Try to delete User A's trip

**Expected Result:**
- Status: `403 Forbidden`

---

### ❌ Test 5.3: Delete Non-existent Trip
**Test Data:**
- Path parameter: non-existent ID

**Expected Result:**
- Status: `404 Not Found`

---

### ❌ Test 5.4: Delete without Authentication
**Expected Result:**
- Status: `401 Unauthorized`

---

### ❌ Test 5.5: Delete Already Deleted Trip
**Steps:**
1. Delete a trip
2. Try to delete same trip again

**Expected Result:**
- Status: `404 Not Found`

---

## Test Suite 6: Trip Status Logic

### Test 6.1: Status Changes Over Time
**Scenario:** Create a trip and verify status changes

**Steps:**
1. Create trip with future dates → Status: UPCOMING
2. Update dates to current period → Status: ONGOING
3. Update dates to past → Status: COMPLETED

**Verification:**
- [ ] Status automatically calculated on create
- [ ] Status recalculated on update
- [ ] Status logic is correct

---

### Test 6.2: Status Calculation Edge Cases

**Test 6.2a: Same Day Trip**
```json
{
  "name": "Same Day Trip",
  "startDate": "2026-05-10",
  "endDate": "2026-05-10"
}
```
**Expected:** Status based on whether date is past/present/future

**Test 6.2b: Trip Starting Today**
```json
{
  "name": "Starting Today",
  "startDate": "2026-05-10",
  "endDate": "2026-05-15"
}
```
**Expected:** Status: ONGOING (if today is 2026-05-10)

**Test 6.2c: Trip Ending Today**
```json
{
  "name": "Ending Today",
  "startDate": "2026-05-05",
  "endDate": "2026-05-10"
}
```
**Expected:** Status: ONGOING (if today is 2026-05-10)

---

## Test Suite 7: Data Validation

### Test 7.1: Very Long Trip Name
**Test Data:**
```json
{
  "name": "A".repeat(500),
  "startDate": "2026-07-01",
  "endDate": "2026-07-15"
}
```

**Expected Result:**
- Should handle gracefully (accept or reject with limit)

---

### Test 7.2: Special Characters in Name
**Test Data:**
```json
{
  "name": "Trip to São Paulo & México 🌎",
  "startDate": "2026-07-01",
  "endDate": "2026-07-15"
}
```

**Expected Result:**
- Status: `201 Created`
- Special characters and emojis preserved

---

### Test 7.3: Very Long Description
**Test Data:**
```json
{
  "name": "Test Trip",
  "startDate": "2026-07-01",
  "endDate": "2026-07-15",
  "description": "A".repeat(10000)
}
```

**Expected Result:**
- Should handle gracefully

---

### Test 7.4: Invalid URL in coverPhoto
**Test Data:**
```json
{
  "name": "Test Trip",
  "startDate": "2026-07-01",
  "endDate": "2026-07-15",
  "coverPhoto": "not-a-url"
}
```

**Expected Result:**
- Should accept (validation is optional) or reject with clear error

---

## Test Suite 8: Performance & Edge Cases

### Test 8.1: Create Many Trips
**Steps:**
1. Create 50 trips for one user
2. Get all trips

**Expected Result:**
- All trips created successfully
- GET request returns all trips
- Response time acceptable (<2 seconds)

**Verification:**
- [ ] No performance degradation
- [ ] All trips returned
- [ ] Correct grouping by status

---

### Test 8.2: Concurrent Updates
**Steps:**
1. Open two Swagger UI tabs
2. Update same trip simultaneously from both tabs

**Expected Result:**
- Both updates succeed (last write wins)
- No data corruption
- updatedAt reflects latest update

---

### Test 8.3: Trip with Sections and Activities
**Prerequisites:** Create trip with nested sections and activities

**Verification:**
- [ ] GET trip includes nested data
- [ ] Deleting trip cascades to sections and activities
- [ ] Update trip doesn't affect nested data

---

## Test Suite 9: Integration Tests

### Test 9.1: Complete Trip Lifecycle
**Steps:**
1. Register user
2. Login
3. Create trip
4. Get all trips (verify it appears)
5. Get trip by ID
6. Update trip
7. Get trip again (verify update)
8. Delete trip
9. Get all trips (verify it's gone)

**Verification:**
- [ ] All operations work in sequence
- [ ] Data consistency maintained
- [ ] No orphaned data

---

### Test 9.2: Multi-User Scenario
**Steps:**
1. User A creates 3 trips
2. User B creates 2 trips
3. User A gets trips (should see only their 3)
4. User B gets trips (should see only their 2)
5. User A tries to access User B's trip (should fail)

**Verification:**
- [ ] Complete data isolation
- [ ] No cross-user access
- [ ] Authorization working correctly

---

## Test Execution Checklist

### Before Testing:
- [ ] Server running
- [ ] Database migrated
- [ ] User registered and logged in
- [ ] Access token set in Swagger

### During Testing:
- [ ] Test in order
- [ ] Record results
- [ ] Check database state
- [ ] Verify status calculations
- [ ] Test authorization

### After Testing:
- [ ] All CRUD operations work
- [ ] Status logic correct
- [ ] Authorization enforced
- [ ] Data validation working
- [ ] No data leakage between users

---

## Test Results Template

```
Test Date: ___________
Tester: ___________
User ID: ___________

| Test ID | Test Name | Status | Notes |
|---------|-----------|--------|-------|
| 1.1 | Create Trip Successfully | ☐ Pass ☐ Fail | |
| 1.2 | Create Minimal Trip | ☐ Pass ☐ Fail | |
| ... | ... | ... | |

Issues Found:
1. 
2. 

Overall Status: ☐ All Pass ☐ Some Failures
```

---

**Last Updated:** 2026-05-10  
**Version:** 1.0.0  
**Status:** Ready for Testing
