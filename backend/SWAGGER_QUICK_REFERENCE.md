# 📚 Swagger Quick Reference Card

## 🌐 Access
```
http://localhost:5000/api-docs
```

---

## 🔐 Quick Start (3 Steps)

### 1️⃣ Get Token
- **Register**: `POST /api/auth/register`
- **Login**: `POST /api/auth/login`
- Copy the `token` from response

### 2️⃣ Authorize
- Click **"Authorize"** button (🔓 top right)
- Enter: `Bearer YOUR_TOKEN_HERE`
- Click **"Authorize"** → **"Close"**

### 3️⃣ Create Trip
- `POST /api/trips` → Copy the trip `id`
- Use this ID for Notes, Checklist, and Invoice

---

## 📝 Notes API (5 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trips/{tripId}/notes` | List all notes |
| POST | `/api/trips/{tripId}/notes` | Create note |
| PATCH | `/api/trips/{tripId}/notes/{noteId}` | Update note |
| DELETE | `/api/trips/{tripId}/notes/{noteId}` | Delete note |
| PATCH | `/api/trips/{tripId}/notes/{noteId}/bookmark` | Toggle bookmark |

**Sample Request:**
```json
{
  "title": "Day 1 - Arrival",
  "body": "Amazing first day!",
  "bookmarked": false
}
```

---

## ✅ Checklist API (6 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trips/{tripId}/checklist` | Get/create checklist |
| POST | `/api/trips/{tripId}/checklist/items` | Add item |
| PATCH | `/api/trips/{tripId}/checklist/items/{itemId}` | Toggle checked |
| PUT | `/api/trips/{tripId}/checklist/items/{itemId}` | Update item |
| DELETE | `/api/trips/{tripId}/checklist/items/{itemId}` | Delete item |
| POST | `/api/trips/{tripId}/checklist/reset` | Reset all |

**Sample Request:**
```json
{
  "label": "Passport",
  "category": "Documents"
}
```

**Toggle Checked:**
```json
{
  "checked": true
}
```

---

## 🌍 Community API (4 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/community?page=1&limit=10` | Get posts (paginated) |
| POST | `/api/community` | Create post |
| POST | `/api/community/{postId}/like` | Like post |
| DELETE | `/api/community/{postId}` | Delete post |

**Sample Request:**
```json
{
  "body": "Just returned from Bali! 🏖️",
  "imageUrl": "https://example.com/photo.jpg"
}
```

---

## 💰 Invoice API (7 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trips/{tripId}/invoice` | Get invoice |
| PUT | `/api/trips/{tripId}/invoice` | Set budget |
| POST | `/api/trips/{tripId}/invoice/items` | Add expense |
| PATCH | `/api/trips/{tripId}/invoice/items/{itemId}` | Update expense |
| DELETE | `/api/trips/{tripId}/invoice/items/{itemId}` | Delete expense |
| PATCH | `/api/trips/{tripId}/invoice/status/paid` | Mark as paid |
| GET | `/api/trips/{tripId}/invoice/export/pdf` | Download PDF |

**Set Budget:**
```json
{
  "totalBudget": 5000
}
```

**Add Expense:**
```json
{
  "category": "Accommodation",
  "description": "Hotel - 5 nights",
  "quantity": 5,
  "unitCost": 150
}
```

---

## 🎯 Test Workflow

```
1. Register/Login → Get token
2. Authorize in Swagger
3. Create Trip → Get tripId
4. Create 3 Notes
5. Toggle 1 Bookmark
6. Add 5 Checklist Items
7. Check 2 Items
8. Create 2 Community Posts
9. Like 1 Post
10. Set Budget ($5000)
11. Add 4 Expenses
12. Export PDF
13. Mark as Paid
```

---

## 📊 Sample Test Data

### Trip
```json
{
  "name": "Paris Summer 2026",
  "destination": "Paris, France",
  "budget": 5000,
  "startDate": "2026-07-01",
  "endDate": "2026-07-15"
}
```

### Note
```json
{
  "title": "Day 1 - Eiffel Tower",
  "body": "The view was breathtaking!",
  "bookmarked": true
}
```

### Checklist Items
```json
{"label": "Passport", "category": "Documents"}
{"label": "Sunscreen", "category": "Toiletries"}
{"label": "Camera", "category": "Electronics"}
```

### Community Post
```json
{
  "body": "Amazing trip to Paris! 🗼",
  "imageUrl": "https://example.com/paris.jpg"
}
```

### Invoice Items
```json
{"category": "Hotel", "description": "5 nights", "quantity": 5, "unitCost": 150}
{"category": "Flights", "description": "Round-trip", "quantity": 1, "unitCost": 800}
{"category": "Food", "description": "Daily meals", "quantity": 5, "unitCost": 60}
```

---

## ✅ Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Validation Error |
| 401 | Unauthorized (no/invalid token) |
| 403 | Forbidden (not owner) |
| 404 | Not Found |

---

## 🔍 Common Issues

### "Unauthorized" Error
→ Click Authorize, enter: `Bearer YOUR_TOKEN`

### "Not Found" Error
→ Check if ID is correct

### "Forbidden" Error
→ You don't own this resource

### PDF Not Downloading
→ Check browser download settings

---

## 💡 Pro Tips

1. **Keep IDs**: Copy tripId, noteId, itemId as you create them
2. **Test Pagination**: Try page=1&limit=2 for community
3. **Test Validation**: Try invalid data to see errors
4. **Test PDF**: Open downloaded PDF to verify
5. **Test Calculations**: Verify invoice amounts
6. **Use Schemas**: Click on schema examples in Swagger

---

## 📖 Full Guide

For detailed step-by-step instructions:
```
backend/SWAGGER_TESTING_GUIDE.md
```

---

## 🎉 Quick Verification

After testing, you should have:
- ✅ 1 User account
- ✅ 1 Trip
- ✅ 3-5 Notes
- ✅ 8-10 Checklist items
- ✅ 3-4 Community posts
- ✅ 5-6 Invoice items
- ✅ 1 Downloaded PDF

---

**Happy Testing! 🚀**
