# Quick Reference Card

## 🚀 Quick Start
```bash
cd backend
bun install
cp .env.example .env
# Edit .env with your DATABASE_URL
bun run generate
bun run migrate
bun run dev
```

## 📍 Important URLs
- **API Base**: http://localhost:5000
- **Swagger Docs**: http://localhost:5000/api-docs
- **Health Check**: http://localhost:5000/health

## 🔑 Auth Endpoints

### Register
```bash
POST /api/auth/register
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone": "+1234567890",      # optional
  "city": "New York",          # optional
  "country": "USA"             # optional
}
```

### Login
```bash
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### Get Profile
```bash
GET /api/users/me
Headers: Authorization: Bearer <token>
```

### Update Profile
```bash
PATCH /api/users/me
Headers: Authorization: Bearer <token>
{
  "firstName": "Jane",
  "city": "Los Angeles"
}
```

### Delete Account
```bash
DELETE /api/users/me
Headers: Authorization: Bearer <token>
```

## 🗺️ Trip Endpoints

### Get All Trips
```bash
GET /api/trips
Headers: Authorization: Bearer <token>

Response:
{
  "ongoing": [...],
  "upcoming": [...],
  "completed": [...]
}
```

### Get Single Trip
```bash
GET /api/trips/:id
Headers: Authorization: Bearer <token>
```

### Create Trip
```bash
POST /api/trips
Headers: Authorization: Bearer <token>
{
  "name": "Summer Vacation",
  "startDate": "2026-07-01",
  "endDate": "2026-07-15",
  "description": "Beach trip",    # optional
  "coverPhoto": "url",            # optional
  "placeId": "place_123"          # optional
}
```

### Update Trip
```bash
PATCH /api/trips/:id
Headers: Authorization: Bearer <token>
{
  "name": "Updated Name",
  "description": "New description"
}
```

### Delete Trip
```bash
DELETE /api/trips/:id
Headers: Authorization: Bearer <token>
```

## 🛠️ Common Commands

```bash
# Development
bun run dev              # Start with hot reload

# Database
bun run generate         # Generate Prisma client
bun run migrate          # Run migrations
bun run prisma           # Open Prisma Studio

# Production
bun start                # Start production server
```

## 🔐 Authorization Header Format
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📊 Response Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized (no/invalid token) |
| 403 | Forbidden (not allowed) |
| 404 | Not Found |
| 409 | Conflict (e.g., email exists) |
| 500 | Server Error |

## 🎯 Trip Status Logic

| Status | Condition |
|--------|-----------|
| UPCOMING | startDate > now |
| ONGOING | startDate ≤ now ≤ endDate |
| COMPLETED | endDate < now |

## 🗄️ Database Models

```
User
├── id: string (cuid)
├── firstName: string
├── lastName: string
├── email: string (unique)
├── password: string (hashed)
├── phone?: string
├── city?: string
├── country?: string
├── role: USER | ADMIN
└── trips: Trip[]

Trip
├── id: string (cuid)
├── name: string
├── placeId?: string
├── startDate: DateTime
├── endDate: DateTime
├── description?: string
├── coverPhoto?: string
├── status: UPCOMING | ONGOING | COMPLETED
├── userId: string
├── user: User
└── sections: Section[]

Section
├── id: string (cuid)
├── name: string
├── tripId: string
├── order: number
├── trip: Trip
└── activities: Activity[]

Activity
├── id: string (cuid)
├── name: string
├── description?: string
├── startTime?: DateTime
├── endTime?: DateTime
├── location?: string
├── sectionId: string
├── order: number
└── section: Section
```

## ⚙️ Environment Variables

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d
```

## 🐛 Troubleshooting

**Port in use:**
```bash
# Change PORT in .env
PORT=3000
```

**Database connection failed:**
```bash
# Check DATABASE_URL in .env
# Verify PostgreSQL is running
```

**Prisma client not found:**
```bash
bun run generate
```

**Migration failed:**
```bash
bunx prisma migrate reset  # WARNING: Deletes data
bun run migrate
```

## 📚 Documentation Files

- `README.md` - Full documentation
- `SETUP.md` - Detailed setup guide
- `API_OVERVIEW.md` - Architecture overview
- `QUICK_REFERENCE.md` - This file
- `swagger.example.md` - Swagger annotation examples

## 🎨 Swagger UI Tips

1. Open http://localhost:5000/api-docs
2. Click "Authorize" button (top right)
3. Register via `/api/auth/register`
4. Copy `accessToken` from response
5. Paste in authorization dialog
6. Now you can test all protected endpoints!

## 💡 Pro Tips

- Use Swagger UI for testing (easier than curl)
- Check Prisma Studio for database inspection
- Winston logs are in `logs/` folder
- All passwords are bcrypt hashed
- JWT tokens expire (check expiry times)
- Trip status updates automatically based on dates
