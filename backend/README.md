# Backend API

A robust Express.js backend with TypeScript, Prisma ORM, JWT authentication, and Swagger documentation.

## 🚀 Features

- ✅ **Authentication System** - Register, Login, JWT tokens
- ✅ **User Management** - Profile CRUD operations
- ✅ **Trip Management** - Full CRUD for trips with sections and activities
- ✅ **Swagger Documentation** - Interactive API docs at `/api-docs`
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Validation** - Zod schema validation
- ✅ **Security** - Helmet, CORS, bcrypt password hashing
- ✅ **Logging** - Winston logger with Morgan HTTP logging
- ✅ **Database** - PostgreSQL with Prisma ORM

## 📁 Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── config/
│   │   ├── db.ts              # Prisma client
│   │   ├── env.ts             # Environment validation
│   │   ├── logger.ts          # Winston logger
│   │   └── swagger.ts         # Swagger configuration
│   ├── controllers/
│   │   ├── auth.controller.ts # Auth endpoints
│   │   └── trip.controller.ts # Trip endpoints
│   ├── middlewares/
│   │   ├── auth.ts            # JWT authentication
│   │   ├── adminOnly.ts       # Admin authorization
│   │   ├── validate.ts        # Zod validation
│   │   └── errorHandler.ts   # Global error handler
│   ├── repositories/
│   │   ├── user.repo.ts       # User database operations
│   │   └── trip.repo.ts       # Trip database operations
│   ├── routes/
│   │   ├── auth.routes.ts     # Auth routes
│   │   └── trip.routes.ts     # Trip routes
│   ├── services/
│   │   ├── auth.service.ts    # Auth business logic
│   │   └── trip.service.ts    # Trip business logic
│   ├── utils/
│   │   ├── AppError.ts        # Custom error class
│   │   ├── hash.ts            # Password hashing
│   │   └── jwt.ts             # JWT utilities
│   ├── validators/
│   │   ├── auth.validator.ts  # Auth validation schemas
│   │   └── trip.validator.ts  # Trip validation schemas
│   ├── app.ts                 # Express app setup
│   └── server.ts              # Server entry point
└── package.json
```

## 🛠️ Setup Instructions

### Prerequisites

- [Bun](https://bun.sh) runtime installed
- PostgreSQL database (local or cloud)

### Installation

1. **Install dependencies:**
   ```bash
   cd backend
   bun install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/tripdb"
   JWT_SECRET=your-secret-key
   JWT_REFRESH_SECRET=your-refresh-secret
   ```

3. **Run database migrations:**
   ```bash
   bun run generate  # Generate Prisma client
   bun run migrate   # Run migrations
   ```

4. **Start the server:**
   ```bash
   bun run dev       # Development with hot reload
   # or
   bun start         # Production mode
   ```

## 📚 API Documentation

Once the server is running, access:

- **Swagger UI**: http://localhost:5000/api-docs
- **Swagger JSON**: http://localhost:5000/api-docs.json
- **Health Check**: http://localhost:5000/health

## 🔐 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/users/me` | Get current user profile | Yes |
| PATCH | `/api/users/me` | Update profile | Yes |
| DELETE | `/api/users/me` | Delete account | Yes |

### Trips

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/trips` | Get all user trips | Yes |
| GET | `/api/trips/:id` | Get trip by ID | Yes |
| POST | `/api/trips` | Create new trip | Yes |
| PATCH | `/api/trips/:id` | Update trip | Yes |
| DELETE | `/api/trips/:id` | Delete trip | Yes |

## 🔑 Authentication Flow

1. **Register**: `POST /api/auth/register`
   ```json
   {
     "firstName": "John",
     "lastName": "Doe",
     "email": "john@example.com",
     "password": "SecurePass123!"
   }
   ```

2. **Login**: `POST /api/auth/login`
   ```json
   {
     "email": "john@example.com",
     "password": "SecurePass123!"
   }
   ```

3. **Use Token**: Add to headers for protected routes
   ```
   Authorization: Bearer <your-access-token>
   ```

## 🗄️ Database Schema

### User
- id, firstName, lastName, email, password
- phone, city, country, role
- timestamps

### Trip
- id, name, placeId, startDate, endDate
- description, coverPhoto, status, userId
- timestamps

### Section
- id, name, tripId, order
- timestamps

### Activity
- id, name, description, startTime, endTime
- location, sectionId, order
- timestamps

## 📝 Scripts

```bash
bun run dev        # Start development server with hot reload
bun start          # Start production server
bun run prisma     # Open Prisma Studio (database GUI)
bun run migrate    # Run database migrations
bun run generate   # Generate Prisma client
```

## 🧪 Testing with Swagger

1. Start the server: `bun run dev`
2. Open http://localhost:5000/api-docs
3. Click "Authorize" button
4. Register a user via `/api/auth/register`
5. Copy the `accessToken` from response
6. Paste token in authorization dialog
7. Test protected endpoints!

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Access & refresh tokens
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Express rate limit
- **Input Validation**: Zod schemas
- **SQL Injection Protection**: Prisma ORM

## 🚢 Deployment

The app is ready to deploy to:
- **Vercel** (serverless)
- **Railway** (with PostgreSQL)
- **Render** (web service + database)
- **Fly.io** (containers)
- **AWS/GCP/Azure** (VMs or containers)

## 📦 Tech Stack

- **Runtime**: Bun
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **Authentication**: JWT (jsonwebtoken)
- **Password**: bcryptjs
- **Logging**: Winston + Morgan
- **Documentation**: Swagger (OpenAPI 3.0)
- **Security**: Helmet, CORS

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

MIT
