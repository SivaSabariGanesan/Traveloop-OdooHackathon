# 🐳 Docker Setup Guide

Complete guide for running the backend with PostgreSQL using Docker.

---

## 📋 Prerequisites

- Docker installed ([Get Docker](https://docs.docker.com/get-docker/))
- Docker Compose installed (included with Docker Desktop)
- Bun installed locally (for development) - [Get Bun](https://bun.sh)

---

## 🚀 Quick Start

### Option 1: PostgreSQL Only (Recommended for Development)

Run PostgreSQL in Docker, backend on your machine:

```bash
# 1. Start PostgreSQL
docker-compose up -d postgres

# 2. Wait for PostgreSQL to be ready (check health)
docker-compose ps

# 3. Run migrations
bunx prisma migrate dev

# 4. Start backend locally
bun run dev
```

**Access:**
- Backend: http://localhost:5000
- API Docs: http://localhost:5000/api-docs
- PostgreSQL: localhost:5432

---

### Option 2: Full Docker Setup (Backend + PostgreSQL)

Run everything in Docker:

```bash
# 1. Uncomment the backend service in docker-compose.yml

# 2. Build and start all services
docker-compose up -d --build

# 3. Check logs
docker-compose logs -f backend
```

**Access:**
- Backend: http://localhost:5000
- API Docs: http://localhost:5000/api-docs

---

## 📝 Detailed Instructions

### 1. Environment Configuration

Create `.env` file (or use existing):

```env
# Server
NODE_ENV=development
PORT=5000

# Database (Docker PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tripdb?schema=public"

# JWT Secrets (generate your own!)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

**Generate secure secrets:**
```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

---

### 2. Start PostgreSQL

```bash
# Start PostgreSQL container
docker-compose up -d postgres

# Check if it's running
docker-compose ps

# View logs
docker-compose logs postgres

# Check health
docker-compose exec postgres pg_isready -U postgres
```

---

### 3. Database Setup

```bash
# Generate Prisma Client
bunx prisma generate

# Run migrations (creates tables)
bunx prisma migrate dev

# (Optional) Seed database
# bunx prisma db seed

# (Optional) Open Prisma Studio to view data
bunx prisma studio
```

---

### 4. Start Backend

**Option A: Local Development**
```bash
bun run dev
```

**Option B: Docker**
```bash
# Uncomment backend service in docker-compose.yml first
docker-compose up -d backend
```

---

## 🛠️ Common Commands

### Docker Compose

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d postgres

# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f postgres

# Restart service
docker-compose restart postgres

# Check status
docker-compose ps

# Execute command in container
docker-compose exec postgres psql -U postgres -d tripdb
```

### Database Management

```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d tripdb

# Backup database
docker-compose exec postgres pg_dump -U postgres tripdb > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres tripdb < backup.sql

# Reset database (⚠️ deletes all data)
bunx prisma migrate reset

# View database in browser
bunx prisma studio
```

### Prisma Commands

```bash
# Generate Prisma Client
bunx prisma generate

# Create migration
bunx prisma migrate dev --name migration_name

# Apply migrations (production)
bunx prisma migrate deploy

# Reset database
bunx prisma migrate reset

# View database
bunx prisma studio

# Format schema
bunx prisma format

# Validate schema
bunx prisma validate
```

---

## 🔍 Troubleshooting

### PostgreSQL won't start

```bash
# Check if port 5432 is already in use
# Windows
netstat -ano | findstr :5432

# Linux/Mac
lsof -i :5432

# Stop existing PostgreSQL
# Windows (if installed as service)
net stop postgresql-x64-16

# Change port in docker-compose.yml if needed
ports:
  - "5433:5432"  # Use 5433 on host instead

# Update DATABASE_URL
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/tripdb?schema=public"
```

### Connection refused

```bash
# Check if PostgreSQL is running
docker-compose ps

# Check PostgreSQL logs
docker-compose logs postgres

# Test connection
docker-compose exec postgres pg_isready -U postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### Migrations fail

```bash
# Check database connection
bunx prisma db pull

# Reset and reapply migrations
bunx prisma migrate reset

# Force push schema (⚠️ data loss)
bunx prisma db push --force-reset
```

### Backend can't connect to database

```bash
# If running backend locally, use localhost
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tripdb?schema=public"

# If running backend in Docker, use service name
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/tripdb?schema=public"

# Test connection
bunx prisma db pull
```

---

## 🏗️ Production Deployment

### Build Production Image

```bash
# Build image
docker build -t tripdb-backend:latest .

# Run container
docker run -d \
  --name tripdb-backend \
  -p 5000:5000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/tripdb" \
  -e JWT_SECRET="your-secret" \
  -e JWT_REFRESH_SECRET="your-refresh-secret" \
  tripdb-backend:latest
```

### Docker Compose Production

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - backend

  backend:
    build:
      context: .
      dockerfile: Dockerfile
    restart: always
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
      JWT_SECRET: ${JWT_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
    depends_on:
      - postgres
    networks:
      - backend

volumes:
  postgres_data:

networks:
  backend:
```

Deploy:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📊 Monitoring

### View Container Stats

```bash
# Real-time stats
docker stats

# Specific container
docker stats tripdb_postgres
```

### Health Checks

```bash
# PostgreSQL health
docker-compose exec postgres pg_isready -U postgres

# Backend health
curl http://localhost:5000/health
```

### Logs

```bash
# Follow all logs
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100

# Specific service
docker-compose logs -f postgres
```

---

## 🔒 Security Best Practices

### Production Checklist

- [ ] Change default PostgreSQL password
- [ ] Use strong JWT secrets (32+ characters)
- [ ] Enable SSL for PostgreSQL connections
- [ ] Use Docker secrets for sensitive data
- [ ] Run containers as non-root user
- [ ] Enable Docker content trust
- [ ] Regular security updates
- [ ] Backup database regularly
- [ ] Monitor container logs
- [ ] Use environment-specific configs

### Secure PostgreSQL

```yaml
postgres:
  environment:
    POSTGRES_PASSWORD_FILE: /run/secrets/db_password
  secrets:
    - db_password

secrets:
  db_password:
    file: ./secrets/db_password.txt
```

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Bun Documentation](https://bun.sh/docs)

---

## 🆘 Getting Help

If you encounter issues:

1. Check logs: `docker-compose logs -f`
2. Verify services are running: `docker-compose ps`
3. Test database connection: `bunx prisma db pull`
4. Check environment variables: `docker-compose config`
5. Restart services: `docker-compose restart`

---

**Last Updated:** May 10, 2026  
**Docker Version:** 24.0+  
**Docker Compose Version:** 2.20+
