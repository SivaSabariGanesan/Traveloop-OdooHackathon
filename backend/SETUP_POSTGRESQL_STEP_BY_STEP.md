# 🐳 PostgreSQL Setup - Step by Step Guide

Complete walkthrough to get PostgreSQL running with Docker.

---

## Step 1: Install Docker Desktop

### Windows:
1. Download Docker Desktop from: https://www.docker.com/products/docker-desktop
2. Run the installer
3. Restart your computer
4. Open Docker Desktop
5. Wait for "Docker Desktop is running" message

### Mac:
1. Download Docker Desktop for Mac
2. Drag Docker.app to Applications
3. Open Docker Desktop
4. Wait for whale icon in menu bar

### Linux:
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker.io docker-compose

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker
```

**✅ Verify Docker is running:**
```bash
docker --version
docker ps
```

---

## Step 2: Start Docker Desktop

**Windows/Mac:**
1. Open Docker Desktop application
2. Wait for "Docker Desktop is running" in the bottom left
3. You should see a green whale icon

**Check if running:**
```bash
docker ps
```

If you see a table (even if empty), Docker is running! ✅

---

## Step 3: Navigate to Backend Folder

```bash
cd backend
```

---

## Step 4: Start PostgreSQL Container

**Option A: Using npm script (Recommended)**
```bash
bun run docker:db
```

**Option B: Using docker-compose directly**
```bash
docker-compose up -d postgres
```

**What this does:**
- Downloads PostgreSQL 16 Alpine image (if not already downloaded)
- Creates a container named `tripdb_postgres`
- Starts PostgreSQL on port 5432
- Creates a volume for data persistence

**Expected output:**
```
[+] Running 2/2
 ✔ Network backend_default       Created
 ✔ Container tripdb_postgres     Started
```

---

## Step 5: Verify PostgreSQL is Running

```bash
# Check container status
docker ps
```

**You should see:**
```
CONTAINER ID   IMAGE                  STATUS         PORTS
abc123...      postgres:16-alpine     Up 10 seconds  0.0.0.0:5432->5432/tcp
```

**Check PostgreSQL health:**
```bash
docker-compose exec postgres pg_isready -U postgres
```

**Expected output:**
```
/var/run/postgresql:5432 - accepting connections
```

✅ PostgreSQL is ready!

---

## Step 6: Generate Prisma Client

```bash
bunx prisma generate
```

**Expected output:**
```
✔ Generated Prisma Client to ./node_modules/@prisma/client
```

---

## Step 7: Run Database Migrations

```bash
bunx prisma migrate dev
```

**What this does:**
- Connects to PostgreSQL
- Creates all tables (users, trips, sections, activities)
- Applies all migrations

**Expected output:**
```
Applying migration `20260510054131_init`
Applying migration `20260510121434_add_password_reset_fields`

✔ Generated Prisma Client

Database synchronized with Prisma schema.
```

---

## Step 8: Verify Database Setup

**Option A: Using Prisma Studio (Visual)**
```bash
bunx prisma studio
```

Opens browser at http://localhost:5555
- You should see: Users, Trips, Sections, Activities tables
- All tables should be empty (no data yet)

**Option B: Using PostgreSQL CLI**
```bash
# Connect to database
docker-compose exec postgres psql -U postgres -d tripdb

# List tables
\dt

# You should see:
# users
# trips
# sections
# activities
# _prisma_migrations

# Exit
\q
```

✅ Database is set up!

---

## Step 9: Start Backend Server

```bash
bun run dev
```

**Expected output:**
```
Server running on port 5000
📚 API Documentation available at http://localhost:5000/api-docs
📄 Swagger JSON available at http://localhost:5000/api-docs.json
```

---

## Step 10: Test Everything Works

### Test 1: Health Check
Open browser: http://localhost:5000/health

**Expected:**
```json
{"status":"ok"}
```

### Test 2: API Documentation
Open browser: http://localhost:5000/api-docs

You should see Swagger UI with all endpoints.

### Test 3: Register a User
In Swagger UI:
1. Click on `POST /api/auth/register`
2. Click "Try it out"
3. Use this data:
```json
{
  "email": "test@example.com",
  "password": "Test@1234",
  "firstName": "Test",
  "lastName": "User"
}
```
4. Click "Execute"

**Expected response: 201 Created**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "...",
      "email": "test@example.com",
      "firstName": "Test",
      "lastName": "User"
    },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

✅ Everything works!

---

## 🎉 You're Done!

Your setup is complete:
- ✅ Docker running
- ✅ PostgreSQL running in container
- ✅ Database tables created
- ✅ Backend server running
- ✅ API working

---

## 🔄 Daily Workflow

### Starting Work:
```bash
# 1. Make sure Docker Desktop is running
# 2. Start PostgreSQL (if not already running)
bun run docker:db

# 3. Start backend
bun run dev
```

### Stopping Work:
```bash
# Stop backend: Ctrl+C

# Stop PostgreSQL (optional - can leave running)
bun run docker:down
```

---

## 🛠️ Useful Commands

### Check Status:
```bash
# Is PostgreSQL running?
docker ps

# View PostgreSQL logs
bun run docker:logs

# Check database connection
bunx prisma db pull
```

### Database Management:
```bash
# View database in browser
bunx prisma studio

# Connect to PostgreSQL CLI
docker-compose exec postgres psql -U postgres -d tripdb

# Backup database
docker-compose exec postgres pg_dump -U postgres tripdb > backup.sql

# Reset database (⚠️ deletes all data)
bunx prisma migrate reset
```

### Docker Management:
```bash
# Start PostgreSQL
bun run docker:db

# Stop all containers
bun run docker:down

# View logs
bun run docker:logs

# Reset everything (⚠️ deletes data)
bun run docker:reset
```

---

## 🔍 Troubleshooting

### Problem: "Docker is not running"

**Solution:**
1. Open Docker Desktop application
2. Wait for it to fully start (green whale icon)
3. Try command again

---

### Problem: "Port 5432 is already in use"

**Solution:**

**Check what's using the port:**
```bash
# Windows
netstat -ano | findstr :5432

# Mac/Linux
lsof -i :5432
```

**Option 1: Stop existing PostgreSQL**
```bash
# Windows (if PostgreSQL installed as service)
net stop postgresql-x64-16

# Mac
brew services stop postgresql

# Linux
sudo systemctl stop postgresql
```

**Option 2: Use different port**

Edit `docker-compose.yml`:
```yaml
postgres:
  ports:
    - "5433:5432"  # Use 5433 instead
```

Update `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/tripdb?schema=public"
```

---

### Problem: "Cannot connect to database"

**Check PostgreSQL is running:**
```bash
docker ps
```

**Check PostgreSQL logs:**
```bash
bun run docker:logs
```

**Test connection:**
```bash
docker-compose exec postgres pg_isready -U postgres
```

**Restart PostgreSQL:**
```bash
bun run docker:down
bun run docker:db
```

---

### Problem: "Migrations fail"

**Reset and try again:**
```bash
bunx prisma migrate reset
bunx prisma migrate dev
```

**Check DATABASE_URL in .env:**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tripdb?schema=public"
```

---

### Problem: "Backend can't connect to database"

**If backend running locally:**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tripdb?schema=public"
```

**If backend running in Docker:**
```env
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/tripdb?schema=public"
```

---

## 📊 Connection Details

| Setting | Value |
|---------|-------|
| Host | `localhost` (or `postgres` if in Docker) |
| Port | `5432` |
| Username | `postgres` |
| Password | `postgres` |
| Database | `tripdb` |

**Connection String:**
```
postgresql://postgres:postgres@localhost:5432/tripdb?schema=public
```

---

## 🎯 Quick Commands Reference

```bash
# Start PostgreSQL
bun run docker:db

# Stop PostgreSQL
bun run docker:down

# View logs
bun run docker:logs

# Run migrations
bunx prisma migrate dev

# View database
bunx prisma studio

# Start backend
bun run dev

# Check status
docker ps
```

---

## 🆘 Need More Help?

1. **Docker Issues:** Make sure Docker Desktop is running
2. **Port Issues:** Check if port 5432 is available
3. **Connection Issues:** Verify DATABASE_URL in .env
4. **Migration Issues:** Try `bunx prisma migrate reset`

**Full documentation:** [DOCKER_SETUP.md](./DOCKER_SETUP.md)

---

**You're all set!** 🚀

If you followed all steps, you should have:
- ✅ PostgreSQL running in Docker
- ✅ Database tables created
- ✅ Backend server running
- ✅ API accessible at http://localhost:5000

**Next:** Start building your features! 🎉
