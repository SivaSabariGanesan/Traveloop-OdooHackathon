# 🚀 Quick Reference Guide

## Server is Running!

**Open these URLs:**
- 🏥 Health Check: http://localhost:5000/health
- 📚 API Documentation: http://localhost:5000/api-docs
- 📄 Swagger JSON: http://localhost:5000/api-docs.json

---

## 5-Minute Quick Test

### 1. Register a User
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test@1234",
  "name": "Test User"
}
```

### 2. Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test@1234"
}
```

**Copy the `accessToken` from response!**

### 3. Create a Trip
```bash
POST http://localhost:5000/api/trips
Authorization: Bearer <your-access-token>
Content-Type: application/json

{
  "name": "Paris Vacation",
  "startDate": "2026-06-01",
  "endDate": "2026-06-10",
  "description": "Summer trip to Paris"
}
```

### 4. Get All Trips
```bash
GET http://localhost:5000/api/trips
Authorization: Bearer <your-access-token>
```

---

## Using Swagger UI (Easiest Way!)

1. Open http://localhost:5000/api-docs
2. Click on any endpoint (e.g., `POST /api/auth/register`)
3. Click "Try it out"
4. Fill in the request body
5. Click "Execute"
6. See the response!

**For protected endpoints:**
1. First login to get your token
2. Click the "Authorize" button at the top
3. Enter: `Bearer <your-access-token>`
4. Click "Authorize"
5. Now all protected endpoints will work!

---

## Common Issues & Solutions

### Server won't start?
```bash
cd backend
bun install
bunx prisma generate
bunx prisma migrate dev
bun run dev
```

### Database issues?
```bash
# Reset database
rm dev.db
bunx prisma migrate dev
```

### Environment variables missing?
Check `backend/.env` file exists and has:
- JWT_SECRET (at least 32 characters)
- JWT_REFRESH_SECRET (at least 32 characters)
- DATABASE_URL="file:./dev.db"

---

## Development Commands

```bash
# Start server
bun run dev

# View database in browser
bunx prisma studio

# Reset database
bunx prisma migrate reset

# Generate Prisma client
bunx prisma generate
```

---

## Password Requirements

When registering/updating users:
- ✅ At least 8 characters
- ✅ At least 1 uppercase letter
- ✅ At least 1 lowercase letter
- ✅ At least 1 number
- ✅ At least 1 special character (!@#$%^&*)

**Example valid password:** `Test@1234`

---

## Rate Limiting

Auth endpoints are rate-limited:
- **5 attempts per 15 minutes** per IP
- Applies to: `/api/auth/login` and `/api/auth/register`
- If you hit the limit, wait 15 minutes or restart the server

---

## Testing Checklist

Use Swagger UI (http://localhost:5000/api-docs) to test:

### Authentication:
- [ ] Register new user
- [ ] Login with credentials
- [ ] Get current user profile
- [ ] Update user profile
- [ ] Refresh access token

### Trips:
- [ ] Create a trip
- [ ] Get all trips
- [ ] Get single trip
- [ ] Update trip
- [ ] Change trip status
- [ ] Delete trip

---

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middlewares/    # Auth, validation, error handling
│   ├── repositories/   # Database queries
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Helper functions
│   └── validators/     # Zod schemas
├── prisma/
│   └── schema.prisma   # Database schema
├── tests/              # Manual test documentation
└── .env                # Environment variables
```

---

## Need Help?

1. **Testing Guide:** `backend/TESTING_GUIDE.md`
2. **Full Documentation:** `backend/IMPLEMENTATION_COMPLETE.md`
3. **Security Details:** `backend/SECURITY_FIXES.md`
4. **API Overview:** `backend/API_OVERVIEW.md`

---

## Will it run on your friend's laptop?

**Requirements:**
- ✅ Bun installed (https://bun.sh)
- ✅ Node.js 18+ (for tsx)
- ✅ 100MB disk space
- ✅ Any OS (Windows, Mac, Linux)

**Setup on new machine:**
```bash
# 1. Clone/copy the project
cd backend

# 2. Install dependencies
bun install

# 3. Setup database
bunx prisma generate
bunx prisma migrate dev

# 4. Start server
bun run dev
```

**That's it!** Server will run on http://localhost:5000

---

**Pro Tip:** Keep the Swagger UI open while developing - it's the easiest way to test your API!
