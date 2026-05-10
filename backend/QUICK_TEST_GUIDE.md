# Quick Test Guide for New Features

## Prerequisites

1. **Server Running:**
```bash
cd backend
bun run dev
```

2. **Get Auth Token:**
   - Register/Login via `/api/auth/register` or `/api/auth/login`
   - Copy the JWT token from response

3. **Create a Trip:**
   - POST to `/api/trips` with trip details
   - Copy the trip ID from response

---

## Test Scenarios

### 🗒️ Notes Feature

**1. Create a note:**
```bash
curl -X POST http://localhost:5000/api/trips/YOUR_TRIP_ID/notes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Day 1 - Arrival",
    "body": "Arrived at the hotel. Weather is perfect!",
    "bookmarked": false
  }'
```

**2. Get all notes:**
```bash
curl http://localhost:5000/api/trips/YOUR_TRIP_ID/notes \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**3. Toggle bookmark:**
```bash
curl -X PATCH http://localhost:5000/api/trips/YOUR_TRIP_ID/notes/NOTE_ID/bookmark \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**4. Update note:**
```bash
curl -X PATCH http://localhost:5000/api/trips/YOUR_TRIP_ID/notes/NOTE_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Day 1 - Updated",
    "body": "Updated content..."
  }'
```

**5. Delete note:**
```bash
curl -X DELETE http://localhost:5000/api/trips/YOUR_TRIP_ID/notes/NOTE_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### ✅ Checklist Feature

**1. Get/Create checklist:**
```bash
curl http://localhost:5000/api/trips/YOUR_TRIP_ID/checklist \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**2. Add items:**
```bash
# Passport
curl -X POST http://localhost:5000/api/trips/YOUR_TRIP_ID/checklist/items \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"label": "Passport", "category": "Documents"}'

# Sunscreen
curl -X POST http://localhost:5000/api/trips/YOUR_TRIP_ID/checklist/items \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"label": "Sunscreen", "category": "Toiletries"}'

# Camera
curl -X POST http://localhost:5000/api/trips/YOUR_TRIP_ID/checklist/items \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"label": "Camera", "category": "Electronics"}'
```

**3. Toggle item checked:**
```bash
curl -X PATCH http://localhost:5000/api/trips/YOUR_TRIP_ID/checklist/items/ITEM_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"checked": true}'
```

**4. Update item:**
```bash
curl -X PUT http://localhost:5000/api/trips/YOUR_TRIP_ID/checklist/items/ITEM_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"label": "Passport (Updated)", "category": "Important Documents"}'
```

**5. Reset all items:**
```bash
curl -X POST http://localhost:5000/api/trips/YOUR_TRIP_ID/checklist/reset \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**6. Delete item:**
```bash
curl -X DELETE http://localhost:5000/api/trips/YOUR_TRIP_ID/checklist/items/ITEM_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 🌍 Community Posts Feature

**1. Create posts:**
```bash
# Post 1
curl -X POST http://localhost:5000/api/community \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "body": "Just returned from an amazing trip to Bali! The beaches were incredible 🏖️"
  }'

# Post 2 with image
curl -X POST http://localhost:5000/api/community \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "body": "Sunset at Santorini - absolutely breathtaking!",
    "imageUrl": "https://example.com/santorini-sunset.jpg"
  }'
```

**2. Get posts (paginated):**
```bash
# First page
curl "http://localhost:5000/api/community?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Second page
curl "http://localhost:5000/api/community?page=2&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**3. Like a post:**
```bash
curl -X POST http://localhost:5000/api/community/POST_ID/like \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**4. Delete post:**
```bash
curl -X DELETE http://localhost:5000/api/community/POST_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 💰 Invoice Feature

**1. Set budget:**
```bash
curl -X PUT http://localhost:5000/api/trips/YOUR_TRIP_ID/invoice \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"totalBudget": 5000}'
```

**2. Add expense items:**
```bash
# Hotel
curl -X POST http://localhost:5000/api/trips/YOUR_TRIP_ID/invoice/items \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Accommodation",
    "description": "Hotel Paris - 5 nights",
    "quantity": 5,
    "unitCost": 150
  }'

# Flights
curl -X POST http://localhost:5000/api/trips/YOUR_TRIP_ID/invoice/items \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Transportation",
    "description": "Round-trip flights",
    "quantity": 1,
    "unitCost": 800
  }'

# Food
curl -X POST http://localhost:5000/api/trips/YOUR_TRIP_ID/invoice/items \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Food & Dining",
    "description": "Daily meals budget",
    "quantity": 5,
    "unitCost": 60
  }'

# Activities
curl -X POST http://localhost:5000/api/trips/YOUR_TRIP_ID/invoice/items \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Activities",
    "description": "Museum tickets & tours",
    "quantity": 3,
    "unitCost": 45
  }'
```

**3. Get invoice:**
```bash
curl http://localhost:5000/api/trips/YOUR_TRIP_ID/invoice \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**4. Update item:**
```bash
curl -X PATCH http://localhost:5000/api/trips/YOUR_TRIP_ID/invoice/items/ITEM_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 6,
    "unitCost": 140
  }'
```

**5. Mark as paid:**
```bash
curl -X PATCH http://localhost:5000/api/trips/YOUR_TRIP_ID/invoice/status/paid \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**6. Export PDF:**
```bash
curl http://localhost:5000/api/trips/YOUR_TRIP_ID/invoice/export/pdf \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --output invoice.pdf
```

**7. Delete item:**
```bash
curl -X DELETE http://localhost:5000/api/trips/YOUR_TRIP_ID/invoice/items/ITEM_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Using Postman/Thunder Client

### Setup:
1. Create a new collection
2. Add environment variables:
   - `baseUrl`: `http://localhost:5000`
   - `token`: Your JWT token
   - `tripId`: Your trip ID

### Headers for all requests:
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

### Example Requests:

**Notes - Create:**
- Method: POST
- URL: `{{baseUrl}}/api/trips/{{tripId}}/notes`
- Body:
```json
{
  "title": "Day 1",
  "body": "Great start!",
  "bookmarked": false
}
```

**Checklist - Add Item:**
- Method: POST
- URL: `{{baseUrl}}/api/trips/{{tripId}}/checklist/items`
- Body:
```json
{
  "label": "Passport",
  "category": "Documents"
}
```

**Community - Create Post:**
- Method: POST
- URL: `{{baseUrl}}/api/community`
- Body:
```json
{
  "body": "Amazing trip!",
  "imageUrl": "https://example.com/photo.jpg"
}
```

**Invoice - Add Item:**
- Method: POST
- URL: `{{baseUrl}}/api/trips/{{tripId}}/invoice/items`
- Body:
```json
{
  "category": "Hotel",
  "description": "5 nights",
  "quantity": 5,
  "unitCost": 150
}
```

---

## Expected Responses

### Success Response Format:
```json
{
  "status": "success",
  "data": { ... }
}
```

### Error Response Format:
```json
{
  "status": "error",
  "message": "Error description"
}
```

### Validation Error Format:
```json
{
  "message": "Validation error",
  "errors": [
    {
      "path": "title",
      "message": "Title is required"
    }
  ]
}
```

---

## Common Issues & Solutions

### 401 Unauthorized
- Check if token is valid
- Ensure "Bearer " prefix in Authorization header
- Token might be expired - login again

### 403 Forbidden
- You don't own this resource
- Check if you're using the correct user's token

### 404 Not Found
- Check if the ID exists
- Verify the URL path is correct

### 400 Validation Error
- Check request body matches schema
- Ensure all required fields are present
- Verify data types (string, number, boolean)

---

## Testing Workflow

### Complete Flow Test:

1. **Register/Login** → Get token
2. **Create Trip** → Get tripId
3. **Create Notes** → Add 3-5 notes
4. **Toggle Bookmarks** → Bookmark 2 notes
5. **Create Checklist** → Add 10 items in different categories
6. **Check Items** → Mark 5 as checked
7. **Create Posts** → Add 3 community posts
8. **Like Posts** → Like 2 posts
9. **Set Budget** → Set $5000 budget
10. **Add Expenses** → Add 5-10 invoice items
11. **Export PDF** → Download and verify PDF
12. **Mark Paid** → Change invoice status

---

## Swagger UI Testing

Access interactive API docs at:
```
http://localhost:5000/api-docs
```

1. Click "Authorize" button
2. Enter: `Bearer YOUR_TOKEN`
3. Click "Authorize"
4. Test endpoints directly in the UI

---

## Quick Verification Script

Save as `test-features.sh`:

```bash
#!/bin/bash

TOKEN="your-token-here"
TRIP_ID="your-trip-id-here"
BASE_URL="http://localhost:5000"

echo "Testing Notes..."
curl -X POST "$BASE_URL/api/trips/$TRIP_ID/notes" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","body":"Test note"}'

echo "\n\nTesting Checklist..."
curl "$BASE_URL/api/trips/$TRIP_ID/checklist" \
  -H "Authorization: Bearer $TOKEN"

echo "\n\nTesting Community..."
curl -X POST "$BASE_URL/api/community" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"body":"Test post"}'

echo "\n\nTesting Invoice..."
curl -X PUT "$BASE_URL/api/trips/$TRIP_ID/invoice" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"totalBudget":1000}'

echo "\n\nAll tests complete!"
```

Run with:
```bash
chmod +x test-features.sh
./test-features.sh
```

---

**Happy Testing! 🚀**
