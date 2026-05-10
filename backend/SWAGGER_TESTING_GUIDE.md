# 📚 Swagger Testing Guide

## 🚀 Access Swagger UI

Open your browser and navigate to:
```
http://localhost:5000/api-docs
```

---

## 🔐 Step 1: Authentication

Before testing the new features, you need to authenticate and get a JWT token.

### 1.1 Register a New User (if needed)

1. Find **Auth** section in Swagger
2. Click on `POST /api/auth/register`
3. Click **"Try it out"**
4. Enter the request body:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "phone": "+1234567890",
  "city": "New York",
  "country": "USA"
}
```

5. Click **"Execute"**
6. Copy the `token` from the response

### 1.2 Or Login with Existing User

1. Click on `POST /api/auth/login`
2. Click **"Try it out"**
3. Enter credentials:

```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

4. Click **"Execute"**
5. Copy the `token` from the response

### 1.3 Authorize in Swagger

1. Click the **"Authorize"** button at the top right (🔓 icon)
2. In the popup, enter: `Bearer YOUR_TOKEN_HERE`
   - Example: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
3. Click **"Authorize"**
4. Click **"Close"**

✅ You're now authenticated! All requests will include your token.

---

## 🗺️ Step 2: Create a Trip

You need a trip ID to test Notes, Checklist, and Invoice features.

1. Find **Trips** section
2. Click on `POST /api/trips`
3. Click **"Try it out"**
4. Enter trip details:

```json
{
  "name": "Summer Vacation 2026",
  "destination": "Paris, France",
  "budget": 5000,
  "startDate": "2026-07-01",
  "endDate": "2026-07-15",
  "description": "A relaxing vacation in Paris"
}
```

5. Click **"Execute"**
6. **Copy the trip `id`** from the response - you'll need this!

---

## 📝 Step 3: Test Notes Feature

### 3.1 Create Notes

1. Find **Notes** section
2. Click on `POST /api/trips/{tripId}/notes`
3. Click **"Try it out"**
4. Enter your **tripId** in the parameter field
5. Enter note data:

```json
{
  "title": "Day 1 - Arrival in Paris",
  "body": "Arrived at the hotel around 3 PM. The weather is perfect and the city is beautiful! Can't wait to explore tomorrow.",
  "bookmarked": false
}
```

6. Click **"Execute"**
7. Verify response shows status 201

**Create 2-3 more notes:**

```json
{
  "title": "Day 2 - Eiffel Tower",
  "body": "Visited the Eiffel Tower today. The view from the top was absolutely breathtaking!",
  "bookmarked": true
}
```

```json
{
  "title": "Day 3 - Louvre Museum",
  "body": "Spent the entire day at the Louvre. Saw the Mona Lisa and many other masterpieces.",
  "bookmarked": false
}
```

### 3.2 Get All Notes

1. Click on `GET /api/trips/{tripId}/notes`
2. Click **"Try it out"**
3. Enter your **tripId**
4. Click **"Execute"**
5. Verify you see all your notes

### 3.3 Toggle Bookmark

1. Click on `PATCH /api/trips/{tripId}/notes/{noteId}/bookmark`
2. Click **"Try it out"**
3. Enter **tripId** and **noteId** (from a note you created)
4. Click **"Execute"**
5. Verify the bookmark status changed

### 3.4 Update a Note

1. Click on `PATCH /api/trips/{tripId}/notes/{noteId}`
2. Click **"Try it out"**
3. Enter **tripId** and **noteId**
4. Update the note:

```json
{
  "title": "Day 1 - Arrival in Paris (Updated)",
  "body": "Updated: Arrived at the hotel around 3 PM. Had dinner at a lovely café nearby."
}
```

5. Click **"Execute"**

### 3.5 Delete a Note

1. Click on `DELETE /api/trips/{tripId}/notes/{noteId}`
2. Click **"Try it out"**
3. Enter **tripId** and **noteId**
4. Click **"Execute"**
5. Verify deletion message

---

## ✅ Step 4: Test Checklist Feature

### 4.1 Get/Create Checklist

1. Find **Checklist** section
2. Click on `GET /api/trips/{tripId}/checklist`
3. Click **"Try it out"**
4. Enter your **tripId**
5. Click **"Execute"**
6. Verify checklist is created (empty items array)

### 4.2 Add Items

1. Click on `POST /api/trips/{tripId}/checklist/items`
2. Click **"Try it out"**
3. Enter **tripId**
4. Add items one by one:

**Documents:**
```json
{
  "label": "Passport",
  "category": "Documents"
}
```

```json
{
  "label": "Travel Insurance",
  "category": "Documents"
}
```

**Clothing:**
```json
{
  "label": "T-shirts (5)",
  "category": "Clothing"
}
```

```json
{
  "label": "Jeans (2 pairs)",
  "category": "Clothing"
}
```

**Toiletries:**
```json
{
  "label": "Toothbrush & Toothpaste",
  "category": "Toiletries"
}
```

```json
{
  "label": "Sunscreen",
  "category": "Toiletries"
}
```

**Electronics:**
```json
{
  "label": "Phone Charger",
  "category": "Electronics"
}
```

```json
{
  "label": "Camera",
  "category": "Electronics"
}
```

### 4.3 Toggle Items as Checked

1. Click on `PATCH /api/trips/{tripId}/checklist/items/{itemId}`
2. Click **"Try it out"**
3. Enter **tripId** and **itemId** (from an item you created)
4. Check the item:

```json
{
  "checked": true
}
```

5. Click **"Execute"**
6. Repeat for 3-4 items

### 4.4 Update an Item

1. Click on `PUT /api/trips/{tripId}/checklist/items/{itemId}`
2. Click **"Try it out"**
3. Enter **tripId** and **itemId**
4. Update:

```json
{
  "label": "Passport (IMPORTANT)",
  "category": "Critical Documents"
}
```

5. Click **"Execute"**

### 4.5 Get Checklist Again

1. Click on `GET /api/trips/{tripId}/checklist`
2. Verify all items are there with correct checked status

### 4.6 Reset Checklist

1. Click on `POST /api/trips/{tripId}/checklist/reset`
2. Click **"Try it out"**
3. Enter **tripId**
4. Click **"Execute"**
5. Get checklist again - all items should be unchecked

### 4.7 Delete an Item

1. Click on `DELETE /api/trips/{tripId}/checklist/items/{itemId}`
2. Click **"Try it out"**
3. Enter **tripId** and **itemId**
4. Click **"Execute"**

---

## 🌍 Step 5: Test Community Feature

### 5.1 Create Posts

1. Find **Community** section
2. Click on `POST /api/community`
3. Click **"Try it out"**
4. Create several posts:

**Post 1:**
```json
{
  "body": "Just returned from an amazing trip to Bali! The beaches were incredible and the people were so friendly. Highly recommend! 🏖️"
}
```

**Post 2 with image:**
```json
{
  "body": "Sunset at Santorini - absolutely breathtaking! This is why I love traveling ❤️",
  "imageUrl": "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e"
}
```

**Post 3:**
```json
{
  "body": "Pro tip: Always book your accommodations at least 2 months in advance for better deals! 💡"
}
```

**Post 4:**
```json
{
  "body": "Tokyo is calling! Planning my next adventure to Japan. Any recommendations? 🇯🇵"
}
```

5. Click **"Execute"** for each post

### 5.2 Get All Posts

1. Click on `GET /api/community`
2. Click **"Try it out"**
3. Try different pagination:
   - page: 1, limit: 10
   - page: 1, limit: 2
4. Click **"Execute"**
5. Verify pagination data is correct

### 5.3 Like Posts

1. Click on `POST /api/community/{postId}/like`
2. Click **"Try it out"**
3. Enter a **postId** from one of your posts
4. Click **"Execute"**
5. Like it multiple times to see the counter increase
6. Repeat for other posts

### 5.4 Get Posts Again

1. Click on `GET /api/community`
2. Verify like counts have increased

### 5.5 Delete a Post

1. Click on `DELETE /api/community/{postId}`
2. Click **"Try it out"**
3. Enter a **postId**
4. Click **"Execute"**
5. Verify deletion message

---

## 💰 Step 6: Test Invoice Feature

### 6.1 Set Budget

1. Find **Invoice** section
2. Click on `PUT /api/trips/{tripId}/invoice`
3. Click **"Try it out"**
4. Enter **tripId**
5. Set budget:

```json
{
  "totalBudget": 5000
}
```

6. Click **"Execute"**

### 6.2 Add Expense Items

1. Click on `POST /api/trips/{tripId}/invoice/items`
2. Click **"Try it out"**
3. Enter **tripId**
4. Add multiple expenses:

**Accommodation:**
```json
{
  "category": "Accommodation",
  "description": "Hotel Paris - 5 nights",
  "quantity": 5,
  "unitCost": 150
}
```

**Flights:**
```json
{
  "category": "Transportation",
  "description": "Round-trip flights",
  "quantity": 1,
  "unitCost": 800
}
```

**Food:**
```json
{
  "category": "Food & Dining",
  "description": "Daily meals budget",
  "quantity": 5,
  "unitCost": 60
}
```

**Activities:**
```json
{
  "category": "Activities",
  "description": "Museum tickets & tours",
  "quantity": 3,
  "unitCost": 45
}
```

**Shopping:**
```json
{
  "category": "Shopping",
  "description": "Souvenirs and gifts",
  "quantity": 1,
  "unitCost": 200
}
```

**Local Transport:**
```json
{
  "category": "Transportation",
  "description": "Metro passes",
  "quantity": 5,
  "unitCost": 15
}
```

5. Click **"Execute"** for each item

### 6.3 Get Invoice

1. Click on `GET /api/trips/{tripId}/invoice`
2. Click **"Try it out"**
3. Enter **tripId**
4. Click **"Execute"**
5. Verify:
   - Total budget: 5000
   - All items listed
   - Amounts calculated correctly (quantity × unitCost)
   - Status: PENDING

### 6.4 Update an Item

1. Click on `PATCH /api/trips/{tripId}/invoice/items/{itemId}`
2. Click **"Try it out"**
3. Enter **tripId** and **itemId**
4. Update:

```json
{
  "quantity": 6,
  "unitCost": 140
}
```

5. Click **"Execute"**
6. Verify amount is recalculated (6 × 140 = 840)

### 6.5 Mark as Paid

1. Click on `PATCH /api/trips/{tripId}/invoice/status/paid`
2. Click **"Try it out"**
3. Enter **tripId**
4. Click **"Execute"**
5. Get invoice again - status should be PAID

### 6.6 Export PDF

1. Click on `GET /api/trips/{tripId}/invoice/export/pdf`
2. Click **"Try it out"**
3. Enter **tripId**
4. Click **"Execute"**
5. Click **"Download file"** button
6. Open the PDF and verify:
   - Trip name and dates
   - Budget summary (Total, Expenses, Remaining)
   - Itemized expenses table
   - Subtotal, Tax (5%), Grand Total
   - Status badge (PAID)
   - Professional formatting

### 6.7 Delete an Item

1. Click on `DELETE /api/trips/{tripId}/invoice/items/{itemId}`
2. Click **"Try it out"**
3. Enter **tripId** and **itemId**
4. Click **"Execute"**
5. Get invoice again - item should be removed

---

## 🧪 Complete Test Workflow

Here's a complete end-to-end test scenario:

### Scenario: Planning a Paris Trip

1. **Register/Login** → Get token → Authorize
2. **Create Trip**: "Paris Summer 2026"
3. **Add 5 Notes**: Daily journal entries
4. **Bookmark 2 Notes**: Important memories
5. **Create Checklist**: Add 10 items across 4 categories
6. **Check 5 Items**: Mark as packed
7. **Create 3 Community Posts**: Share excitement
8. **Like 2 Posts**: Engage with community
9. **Set Budget**: $5000
10. **Add 6 Expenses**: Hotel, flights, food, etc.
11. **Verify Total**: Check budget vs expenses
12. **Export PDF**: Download invoice
13. **Mark as Paid**: Update status
14. **Update Note**: Add final thoughts
15. **Reset Checklist**: Prepare for next trip

---

## ✅ Verification Checklist

After testing, verify:

### Notes
- [ ] Can create notes with title and body
- [ ] Can list all notes for a trip
- [ ] Can toggle bookmark status
- [ ] Can update note content
- [ ] Can delete notes
- [ ] Only owner can modify their notes

### Checklist
- [ ] Checklist auto-creates on first access
- [ ] Can add items with categories
- [ ] Can toggle checked status
- [ ] Can update item label/category
- [ ] Can delete items
- [ ] Can reset all items to unchecked
- [ ] Items grouped by category

### Community
- [ ] Can create posts with/without images
- [ ] Can view paginated feed
- [ ] Pagination works correctly
- [ ] Can like posts (counter increments)
- [ ] Can delete own posts
- [ ] User info included in responses
- [ ] Cannot delete others' posts

### Invoice
- [ ] Can set/update budget
- [ ] Can add expense items
- [ ] Amounts auto-calculate (qty × cost)
- [ ] Can update items (recalculates)
- [ ] Can delete items
- [ ] Can mark as paid/pending
- [ ] PDF exports successfully
- [ ] PDF shows correct calculations
- [ ] PDF includes tax (5%)
- [ ] PDF has professional formatting

---

## 🎯 Expected Results

### Success Responses
All successful operations return:
```json
{
  "status": "success",
  "data": { ... }
}
```

### Error Responses
Errors return appropriate status codes:
- **400**: Validation error
- **401**: Unauthorized (no/invalid token)
- **403**: Forbidden (not owner)
- **404**: Resource not found

---

## 💡 Tips for Testing

1. **Keep IDs Handy**: Copy tripId, noteId, itemId, postId as you create them
2. **Test Pagination**: Try different page/limit values for community posts
3. **Test Validation**: Try invalid data to see error messages
4. **Test Authorization**: Try accessing others' resources (should fail)
5. **Test PDF**: Open the downloaded PDF to verify formatting
6. **Test Calculations**: Verify invoice amounts are correct
7. **Test Bookmarks**: Toggle multiple times to verify state
8. **Test Reset**: Check all items become unchecked

---

## 🐛 Troubleshooting

### "Unauthorized" Error
- Click Authorize button again
- Ensure token has "Bearer " prefix
- Token might be expired - login again

### "Not Found" Error
- Verify the ID is correct
- Check if resource was deleted
- Ensure you're using the right tripId

### "Forbidden" Error
- You don't own this resource
- Login with the correct user

### PDF Not Downloading
- Check browser download settings
- Try different browser
- Check server logs for errors

---

## 📊 Test Data Summary

After completing all tests, you should have:

- ✅ 1 User account
- ✅ 1 Trip
- ✅ 3-5 Notes (some bookmarked)
- ✅ 1 Checklist with 8-10 items
- ✅ 3-4 Community posts (with likes)
- ✅ 1 Invoice with 5-6 expense items
- ✅ 1 Downloaded PDF invoice

---

## 🎉 Success!

If all tests pass, you've successfully verified:
- ✅ All 28 new endpoints work correctly
- ✅ Authentication is enforced
- ✅ Validation is working
- ✅ Authorization checks are in place
- ✅ PDF generation works
- ✅ Pagination works
- ✅ CRUD operations function properly

**Ready for production! 🚀**
