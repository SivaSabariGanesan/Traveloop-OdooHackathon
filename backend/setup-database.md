# Database Setup Guide

## Quick Fix for "Cannot find module" Error

You're seeing this error because the database isn't set up yet. Here's how to fix it:

---

## Option 1: Use SQLite (Easiest - No Installation)

### Step 1: Update Prisma Schema
Edit `prisma/schema.prisma` and change:

```prisma
datasource db {
  provider = "postgresql"
}
```

To:

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

### Step 2: Update .env
Change DATABASE_URL to:
```
DATABASE_URL="file:./dev.db"
```

### Step 3: Generate and Migrate
```bash
bunx prisma generate
bunx prisma migrate dev --name init
```

---

## Option 2: Use PostgreSQL (Production-like)

### Step 1: Install PostgreSQL
Download from: https://www.postgresql.org/download/windows/

Or use Docker:
```bash
docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
```

### Step 2: Create Database
```bash
# Using psql
psql -U postgres
CREATE DATABASE traveloop;
\q
```

### Step 3: Update .env
Your .env already has:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/traveloop?schema=public"
```

### Step 4: Run Migrations
```bash
bunx prisma migrate dev --name init
```

---

## Option 3: Use Cloud Database (Free Tier)

### Supabase (Recommended)
1. Go to https://supabase.com
2. Create free account
3. Create new project
4. Copy connection string
5. Update DATABASE_URL in .env

### Neon
1. Go to https://neon.tech
2. Create free account
3. Create database
4. Copy connection string
5. Update DATABASE_URL in .env

---

## After Database Setup

Run these commands:
```bash
# Generate Prisma client
bunx prisma generate

# Run migrations
bunx prisma migrate dev --name init

# Start server
bun run dev
```

---

## Verify It's Working

1. Server should start without errors
2. Visit: http://localhost:5000/health
3. Should see: `{"status":"ok"}`
4. Visit: http://localhost:5000/api-docs
5. Swagger UI should load

---

## Current Issue

Your server is trying to start but can't find the database. Choose one of the options above to fix it!

**Recommended for quick testing:** Option 1 (SQLite)
**Recommended for production:** Option 2 (PostgreSQL) or Option 3 (Cloud)
