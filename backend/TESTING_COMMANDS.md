# 🧪 Complete Testing Commands

Quick reference for testing your backend with PostgreSQL.

---

## 🔍 1. CHECK SYSTEM STATUS

### Check if PostgreSQL is running:
```bash
docker ps
```
**Expected:** See `tripdb_postgres` container with status "Up"

### Check PostgreSQL health:
```bash
docker-compose exec postgres pg_isready -U postgres
```
**Expected:** `/var/run/postgresql:5432 - accepting connections`

### Check backend server:
```bash
curl http://localhost:5000/health
```
**Expected:** `{"status":"ok"}`

---

## 🚀 2. START/STOP SERVICES

### Start PostgreSQL:
```bash
bun run docker:db
```

### Start Backend:
```bash
bun run dev
```

### Stop Backend:
```
Ctrl+C
```

### Stop PostgreSQL:
```bash
bun run docker:down
```

### Restart Everything:
```bash
bun run docker:down
bun run docker:db
bun run dev
```

---

## 🗄️ 3. DATABASE COMMANDS

### View database in browser (Prisma Studio):
```bash
bunx prisma studio
```
Opens at: http://localhost:5555

### Connect to PostgreSQL CLI:
```bash
docker-compose exec postgres psql -U postgres -d tripdb
```

**Inside PostgreSQL:**
```sql
-- List all tables
\dt

-- View users table
SELECT * FROM users;

-- View trips table
SELECT * FROM trips;

-- Count users
SELECT COUNT(*) FROM users;

-- Exit
\q
```

### Check database connection:
```bash
bunx prisma db pull
```

### Run migrations:
```bash
bunx prisma migrate dev
```

### Reset database (⚠️ deletes all data):
```bash
bunx prisma migrate reset
```

---

## 🧪 4. API TESTING (Using curl)

### Test Health Endpoint:
```bash
curl http://localhost:5000/health
```

### Register a User:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@1234",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@1234"
  }'
```

**Save the token from response!**

### Get User Profile (Protected):
```bash
# Replace YOUR_TOKEN with actual token from login
curl http://localhost:5000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create a Trip (Protected):
```bash
curl -X POST http://localhost:5000/api/trips \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Paris Vacation",
    "startDate": "2026-06-01",
    "endDate": "2026-06-10",
    "description": "Summer trip to Paris"
  }'
```

### Get All Trips (Protected):
```bash
curl http://localhost:5000/api/trips \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🌐 5. BROWSER TESTING (Easiest!)

### Open Swagger UI:
```
http://localhost:5000/api-docs
```

**In Swagger UI:**
1. Click any endpoint (e.g., `POST /api/auth/register`)
2. Click "Try it out"
3. Fill in the request body
4. Click "Execute"
5. See the response!

**For protected endpoints:**
1. First login to get your token
2. Click "Authorize" button (🔓 icon at top)
3. Enter: `Bearer <your-access-token>`
4. Click "Authorize"
5. Now all protected endpoints work!

---

## 🔧 6. DOCKER COMMANDS

### View logs:
```bash
# All services
bun run docker:logs

# PostgreSQL only
docker-compose logs -f postgres

# Last 50 lines
docker-compose logs --tail=50 postgres
```

### Check container status:
```bash
docker ps
```

### Check container stats (CPU, memory):
```bash
docker stats tripdb_postgres
```

### Execute command in PostgreSQL container:
```bash
docker-compose exec postgres bash
```

### Backup database:
```bash
docker-compose exec postgres pg_dump -U postgres tripdb > backup.sql
```

### Restore database:
```bash
docker-compose exec -T postgres psql -U postgres tripdb < backup.sql
```

---

## 🧹 7. CLEANUP COMMANDS

### Remove all data (⚠️ destructive):
```bash
bun run docker:reset
```

### Clean Prisma artifacts:
```bash
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma/client
bun add @prisma/client
bunx prisma generate
```

### Full reset:
```bash
# Stop everything
bun run docker:down

# Remove volumes (deletes data)
docker-compose down -v

# Start fresh
bun run docker:db
bunx prisma migrate dev
bun run dev
```

---

## 📊 8. VERIFICATION CHECKLIST

Run these commands in order to verify everything works:

```bash
# 1. Check PostgreSQL
docker ps

# 2. Check database connection
bunx prisma db pull

# 3. Start backend
bun run dev

# 4. Test health (in new terminal)
curl http://localhost:5000/health

# 5. Open Swagger UI
# Browser: http://localhost:5000/api-docs

# 6. Register user in Swagger UI

# 7. Login in Swagger UI

# 8. Test protected endpoints
```

---

## 🎯 9. QUICK TEST SCRIPT

Copy and paste this entire block:

```bash
# Quick test script
echo "🧪 Testing Backend..."
echo ""

# Test 1: Health
echo "1. Health Check:"
curl -s http://localhost:5000/health
echo ""
echo ""

# Test 2: Register
echo "2. Register User:"
curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"quicktest@example.com","password":"Test@1234","firstName":"Quick","lastName":"Test"}'
echo ""
echo ""

# Test 3: Login
echo "3. Login:"
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"quicktest@example.com","password":"Test@1234"}' \
  | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
echo "Token received: ${TOKEN:0:20}..."
echo ""

# Test 4: Get Profile
echo "4. Get Profile:"
curl -s http://localhost:5000/api/users/me \
  -H "Authorization: Bearer $TOKEN"
echo ""
echo ""

echo "✅ All tests complete!"
```

---

## 🐛 10. TROUBLESHOOTING COMMANDS

### PostgreSQL won't start:
```bash
# Check if port is in use
netstat -ano | findstr :5432

# Restart Docker Desktop
# Then:
bun run docker:db
```

### Backend won't start:
```bash
# Check logs
bun run docker:logs

# Check .env file
cat .env

# Regenerate Prisma
bunx prisma generate

# Try again
bun run dev
```

### Database connection fails:
```bash
# Test connection
bunx prisma db pull

# Check DATABASE_URL
echo $env:DATABASE_URL

# Should be:
# postgresql://postgres:postgres@localhost:5432/tripdb?schema=public
```

### Migrations fail:
```bash
# Reset database
bunx prisma migrate reset

# Run migrations
bunx prisma migrate dev
```

---

## 📱 11. TESTING WITH POSTMAN

### Import this collection:

**Base URL:** `http://localhost:5000`

**Endpoints:**
1. **Register:** POST `/api/auth/register`
2. **Login:** POST `/api/auth/login`
3. **Get Profile:** GET `/api/users/me` (Add Bearer token)
4. **Create Trip:** POST `/api/trips` (Add Bearer token)
5. **Get Trips:** GET `/api/trips` (Add Bearer token)

**Environment Variables:**
- `baseUrl`: `http://localhost:5000`
- `token`: (set after login)

---

## 🎓 12. COMMON WORKFLOWS

### Daily Development:
```bash
# Morning
bun run docker:db    # Start PostgreSQL
bun run dev          # Start backend

# During development
bunx prisma studio   # View database

# Evening
# Ctrl+C              # Stop backend
# (Leave PostgreSQL running)
```

### After Schema Changes:
```bash
bunx prisma migrate dev --name change_description
# Prisma Client auto-regenerates
# Restart backend: Ctrl+C then bun run dev
```

### Before Committing:
```bash
# Test everything works
curl http://localhost:5000/health
bunx prisma validate
bunx prisma format
```

### Deploying:
```bash
# Build Docker image
docker build -t tripdb-backend:latest .

# Or use docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📚 13. USEFUL ALIASES (Optional)

Add to your shell profile:

```bash
# Backend shortcuts
alias bd='cd backend'
alias bdev='bun run dev'
alias bdb='bun run docker:db'
alias bdown='bun run docker:down'
alias blogs='bun run docker:logs'

# Prisma shortcuts
alias pstudio='bunx prisma studio'
alias pgen='bunx prisma generate'
alias pmig='bunx prisma migrate dev'
alias preset='bunx prisma migrate reset'

# Testing shortcuts
alias health='curl http://localhost:5000/health'
alias swagger='open http://localhost:5000/api-docs'
```

---

## ✅ QUICK REFERENCE

| Task | Command |
|------|---------|
| Start PostgreSQL | `bun run docker:db` |
| Start Backend | `bun run dev` |
| Stop All | `bun run docker:down` |
| View Database | `bunx prisma studio` |
| View Logs | `bun run docker:logs` |
| Test API | `http://localhost:5000/api-docs` |
| Health Check | `curl http://localhost:5000/health` |
| Run Migrations | `bunx prisma migrate dev` |
| Reset Database | `bunx prisma migrate reset` |
| Connect to DB | `docker-compose exec postgres psql -U postgres -d tripdb` |

---

## 🎉 YOU'RE READY!

**Everything is working!** Use these commands to test and develop your backend.

**Most Important Commands:**
1. `bun run docker:db` - Start PostgreSQL
2. `bun run dev` - Start backend
3. Open http://localhost:5000/api-docs - Test API

**Happy coding!** 🚀
