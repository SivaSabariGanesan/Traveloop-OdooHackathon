# Quick Setup Guide

## Step-by-Step Setup

### 1. Install Bun (if not installed)
```bash
# Windows (PowerShell)
powershell -c "irm bun.sh/install.ps1 | iex"

# macOS/Linux
curl -fsSL https://bun.sh/install | bash
```

### 2. Install Dependencies
```bash
cd backend
bun install
```

### 3. Setup PostgreSQL Database

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL from https://www.postgresql.org/download/
# Create a database
createdb tripdb
```

**Option B: Cloud Database (Recommended for quick start)**
- [Supabase](https://supabase.com) - Free tier
- [Neon](https://neon.tech) - Free tier
- [Railway](https://railway.app) - Free tier

### 4. Configure Environment
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your database URL
# Example: DATABASE_URL="postgresql://user:password@localhost:5432/tripdb"
```

### 5. Setup Database Schema
```bash
# Generate Prisma client
bun run generate

# Run migrations to create tables
bun run migrate
```

### 6. Start Development Server
```bash
bun run dev
```

### 7. Access the Application
- **API**: http://localhost:5000
- **Swagger Docs**: http://localhost:5000/api-docs
- **Health Check**: http://localhost:5000/health

## Testing the API

### 1. Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

Copy the `accessToken` from the response.

### 3. Create a Trip
```bash
curl -X POST http://localhost:5000/api/trips \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Summer Vacation",
    "startDate": "2026-07-01",
    "endDate": "2026-07-15",
    "description": "Beach vacation"
  }'
```

### 4. Get All Trips
```bash
curl http://localhost:5000/api/trips \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL in .env
- Check PostgreSQL is running
- Test connection: `psql $DATABASE_URL`

### Port Already in Use
```bash
# Change PORT in .env
PORT=3000
```

### Prisma Client Not Generated
```bash
bun run generate
```

### Migration Errors
```bash
# Reset database (WARNING: deletes all data)
bunx prisma migrate reset

# Then run migrations again
bun run migrate
```

## Next Steps

1. ✅ Test all endpoints in Swagger UI
2. ✅ Create some test data
3. ✅ Integrate with frontend
4. ✅ Deploy to production

## Useful Commands

```bash
# View database in GUI
bun run prisma

# Create new migration
bunx prisma migrate dev --name your_migration_name

# Reset database
bunx prisma migrate reset

# Seed database (if you create a seed file)
bunx prisma db seed

# Format Prisma schema
bunx prisma format

# Validate schema
bunx prisma validate
```

## Production Checklist

- [ ] Change JWT_SECRET to strong random value
- [ ] Change JWT_REFRESH_SECRET to strong random value
- [ ] Set NODE_ENV=production
- [ ] Use production database URL
- [ ] Enable HTTPS
- [ ] Set up proper CORS origins
- [ ] Configure rate limiting
- [ ] Set up monitoring/logging
- [ ] Enable database backups
- [ ] Review security headers
