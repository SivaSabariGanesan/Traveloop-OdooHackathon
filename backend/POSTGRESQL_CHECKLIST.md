# ✅ PostgreSQL Setup Checklist

Follow this checklist step by step. Check off each item as you complete it.

---

## 🎯 Pre-Setup

- [ ] **Install Docker Desktop**
  - Download from: https://www.docker.com/products/docker-desktop
  - Install and restart computer
  
- [ ] **Start Docker Desktop**
  - Open Docker Desktop application
  - Wait for "Docker Desktop is running" message
  - Green whale icon should appear

- [ ] **Verify Docker is running**
  ```bash
  docker --version
  docker ps
  ```
  Should show a table (even if empty)

---

## 🐳 PostgreSQL Setup

- [ ] **Navigate to backend folder**
  ```bash
  cd backend
  ```

- [ ] **Start PostgreSQL container**
  ```bash
  bun run docker:db
  ```
  
- [ ] **Verify PostgreSQL is running**
  ```bash
  docker ps
  ```
  Should show `tripdb_postgres` container

- [ ] **Check PostgreSQL health**
  ```bash
  docker-compose exec postgres pg_isready -U postgres
  ```
  Should say "accepting connections"

---

## 🗄️ Database Setup

- [ ] **Generate Prisma Client**
  ```bash
  bunx prisma generate
  ```
  
- [ ] **Run migrations**
  ```bash
  bunx prisma migrate dev
  ```
  Should create all tables

- [ ] **Verify tables exist**
  ```bash
  bunx prisma studio
  ```
  Opens browser - should see Users, Trips, Sections, Activities tables

---

## 🚀 Backend Setup

- [ ] **Start backend server**
  ```bash
  bun run dev
  ```
  
- [ ] **Verify server is running**
  - Should see: "Server running on port 5000"
  - Should see: "API Documentation available at..."

---

## 🧪 Testing

- [ ] **Test health endpoint**
  - Open: http://localhost:5000/health
  - Should see: `{"status":"ok"}`

- [ ] **Test API documentation**
  - Open: http://localhost:5000/api-docs
  - Should see Swagger UI

- [ ] **Test user registration**
  - In Swagger UI, try `POST /api/auth/register`
  - Use test data:
    ```json
    {
      "email": "test@example.com",
      "password": "Test@1234",
      "firstName": "Test",
      "lastName": "User"
    }
    ```
  - Should get 201 response with user data and tokens

- [ ] **Test user login**
  - Try `POST /api/auth/login`
  - Use same credentials
  - Should get 200 response with tokens

- [ ] **Test protected endpoint**
  - Copy accessToken from login response
  - Click "Authorize" button in Swagger
  - Enter: `Bearer <your-token>`
  - Try `GET /api/users/me`
  - Should get your user profile

---

## ✅ Final Verification

- [ ] **All containers running**
  ```bash
  docker ps
  ```
  Should show `tripdb_postgres`

- [ ] **Backend responding**
  ```bash
  curl http://localhost:5000/health
  ```
  Should return `{"status":"ok"}`

- [ ] **Database accessible**
  ```bash
  bunx prisma studio
  ```
  Should open and show tables

- [ ] **Can create users**
  - Register via Swagger UI works ✅
  - Login via Swagger UI works ✅
  - Get profile via Swagger UI works ✅

---

## 🎉 Success!

If all items are checked, your setup is complete! 🚀

**You now have:**
- ✅ PostgreSQL running in Docker
- ✅ Database with all tables
- ✅ Backend server running
- ✅ Full authentication system working
- ✅ API documentation accessible

---

## 📝 Daily Workflow

**Starting work:**
```bash
# 1. Make sure Docker Desktop is running
# 2. Start PostgreSQL
bun run docker:db

# 3. Start backend
bun run dev
```

**Stopping work:**
```bash
# Stop backend: Ctrl+C
# Stop PostgreSQL (optional)
bun run docker:down
```

---

## 🔧 Quick Commands

```bash
# Start PostgreSQL
bun run docker:db

# Stop all
bun run docker:down

# View logs
bun run docker:logs

# View database
bunx prisma studio

# Run migrations
bunx prisma migrate dev

# Check status
docker ps
```

---

## 🆘 Troubleshooting

**If something doesn't work:**

1. ✅ Check Docker Desktop is running
2. ✅ Check PostgreSQL container is running: `docker ps`
3. ✅ Check logs: `bun run docker:logs`
4. ✅ Restart PostgreSQL: `bun run docker:down && bun run docker:db`
5. ✅ Check .env file has correct DATABASE_URL

**Full troubleshooting guide:** [SETUP_POSTGRESQL_STEP_BY_STEP.md](./SETUP_POSTGRESQL_STEP_BY_STEP.md)

---

**Need help?** Check the detailed guide: [SETUP_POSTGRESQL_STEP_BY_STEP.md](./SETUP_POSTGRESQL_STEP_BY_STEP.md)
