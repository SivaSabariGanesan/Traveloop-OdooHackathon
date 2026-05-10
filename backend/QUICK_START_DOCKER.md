# 🚀 Quick Start with Docker

Get up and running in 5 minutes!

---

## ⚡ Super Quick Start

```bash
# 1. Start PostgreSQL
bun run docker:db

# 2. Run migrations
bunx prisma migrate dev

# 3. Start backend
bun run dev
```

**Done!** 🎉

- Backend: http://localhost:5000
- API Docs: http://localhost:5000/api-docs
- Database: localhost:5432

---

## 📋 Step-by-Step Guide

### 1. Prerequisites

Make sure you have installed:
- ✅ Docker Desktop ([Download](https://www.docker.com/products/docker-desktop))
- ✅ Bun ([Download](https://bun.sh))

### 2. Clone & Install

```bash
cd backend
bun install
```

### 3. Start PostgreSQL

```bash
# Start PostgreSQL in Docker
bun run docker:db

# Wait 5 seconds for PostgreSQL to be ready
# Check status
docker ps
```

You should see:
```
CONTAINER ID   IMAGE                  STATUS         PORTS
abc123...      postgres:16-alpine     Up 10 seconds  0.0.0.0:5432->5432/tcp
```

### 4. Setup Database

```bash
# Generate Prisma Client
bunx prisma generate

# Run migrations (creates tables)
bunx prisma migrate dev
```

### 5. Start Backend

```bash
bun run dev
```

You should see:
```
Server running on port 5000
📚 API Documentation available at http://localhost:5000/api-docs
📄 Swagger JSON available at http://localhost:5000/api-docs.json
```

### 6. Test It!

Open http://localhost:5000/api-docs in your browser.

Try registering a user:
```json
{
  "email": "test@example.com",
  "password": "Test@1234",
  "firstName": "Test",
  "lastName": "User"
}
```

---

## 🛠️ Useful Commands

```bash
# Start PostgreSQL
bun run docker:db

# Stop PostgreSQL
bun run docker:down

# View PostgreSQL logs
bun run docker:logs

# Reset database (⚠️ deletes all data)
bun run docker:reset

# View database in browser
bunx prisma studio

# Run migrations
bunx prisma migrate dev

# Generate Prisma Client
bunx prisma generate
```

---

## 🔍 Troubleshooting

### Port 5432 already in use?

```bash
# Check what's using port 5432
# Windows
netstat -ano | findstr :5432

# Mac/Linux
lsof -i :5432

# Option 1: Stop existing PostgreSQL
# Windows (if installed as service)
net stop postgresql-x64-16

# Option 2: Use different port
# Edit docker-compose.yml:
ports:
  - "5433:5432"  # Use 5433 instead

# Update .env:
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/tripdb?schema=public"
```

### Can't connect to database?

```bash
# Check if PostgreSQL is running
docker ps

# Check PostgreSQL logs
bun run docker:logs

# Restart PostgreSQL
bun run docker:down
bun run docker:db
```

### Migrations fail?

```bash
# Reset and try again
bunx prisma migrate reset

# If still failing, check DATABASE_URL in .env
# Should be:
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tripdb?schema=public"
```

---

## 📚 Next Steps

1. ✅ Read the full [Docker Setup Guide](./DOCKER_SETUP.md)
2. ✅ Check [API Documentation](./API_OVERVIEW.md)
3. ✅ Review [Testing Guide](./TESTING_GUIDE.md)
4. ✅ See [Security Audit](./SECURITY_AUDIT_REPORT.md)

---

## 🆘 Need Help?

- **Docker Issues:** See [DOCKER_SETUP.md](./DOCKER_SETUP.md)
- **API Questions:** Check http://localhost:5000/api-docs
- **Database Issues:** Run `bunx prisma studio` to inspect

---

**That's it!** You're ready to develop. 🎉
