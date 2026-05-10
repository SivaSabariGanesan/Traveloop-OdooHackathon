# Traveloop 🌍

Traveloop is a comprehensive, AI-powered travel planning and management platform designed to streamline your adventures. From initial inspiration to financial itemization, Traveloop handles the heavy lifting of travel logistics.

## 🚀 Features

- **AI Trip Planner**: Leveraging Google's Gemini AI to generate tailored itineraries based on your preferences.
- **Role-Based Access Control (RBAC)**: Secure multi-tier access for Users and Admins. Users manage their personal trips, while Admins have oversight of all platform data and analytics.
- **Interactive Itinerary**: Manage your daily stops, activities, and transport in a sleek, responsive interface.
- **Financial Dashboard**: Full-stack Expense Invoice and Budgeting module to track spending vs. budget.
- **Travel Utilities**: Integrated **Notes** and **Checklists** to ensure you never forget a detail or a toothbrush.
- **Aesthetic Design**: Modern UI with dark/light mode support, vibrant color palettes, and smooth transitions.
- **Collaboration**: Share your trips and itineraries with others via unique links.

## 🛠️ Technology Stack

- **Frontend**: React (Vite), TypeScript, Vanilla CSS, Axios, Lucide Icons.
- **Backend**: Node.js (Bun), Express, TypeScript, Zod.
- **Database**: PostgreSQL with Prisma ORM.
- **AI Integration**: Google Gemini API.
- **DevOps**: Docker, Prometheus/Grafana monitoring, Puppeteer for PDF exports.

## 📦 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine.
- PostgreSQL database instance.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SivaSabariGanesan/Traveloop-OdooHackathon.git
   cd Traveloop-OdooHackathon
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   bun install
   # Create a .env file based on .env.example and fill in your credentials
   bun run migrate
   bun run dev
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   bun install
   bun run dev
   ```

## 🏗️ Architecture

The project follows a modular **Repository-Service-Controller (RSC)** pattern in the backend:
- **Controllers**: Handle HTTP requests, parse parameters, and delegate business logic to services.
- **Services**: Contain the core business logic, orchestration of multiple repositories, and external API integrations (like Gemini).
- **Repositories**: Direct abstraction over Prisma to handle all database operations.

### 📂 Backend Folder Structure

The backend is organized for scalability and clarity:

```text
backend/
├── prisma/               # Database schema and migrations
├── src/
│   ├── config/           # Database and logger configurations
│   ├── controllers/      # Route handlers (Request/Response logic)
│   ├── middlewares/      # Auth, Error handling, and Metrics
│   ├── repositories/     # Data access layer (Prisma queries)
│   ├── routes/           # API endpoint definitions
│   ├── services/         # Business logic layer
│   ├── utils/            # Helpers (PDF export, AI integration, etc.)
│   ├── validators/       # Zod validation schemas
│   └── server.ts         # Application entry point
└── tests/                # Unit and integration tests
```

## 🛡️ Technical In-Depth

### 1. Full-Stack Financial Engine
The budgeting module utilizes a complex upsert logic to ensure data integrity. It automatically calculates totals and tax (5%) on the fly, with a real-time budget tracking system that provides visual feedback (SVG Pie Charts) when users approach or exceed their limits.

### 2. AI-Driven Itineraries
The system uses Google's Gemini Pro model via structured prompt engineering. The AI doesn't just suggest places; it generates valid JSON objects that the system directly injects into the user's itinerary, including timing, category-specific icons, and location metadata.

### 3. State Management & Theme System
The frontend implements a high-performance custom Theme Context for dark/light mode synchronization. State management is handled through a combination of React Hooks and context providers, ensuring a snappy, "app-like" feel without the overhead of heavy libraries like Redux.

### 4. Robust Validation & Security
- **Zod**: Every API request is validated against strict TypeScript-aware schemas.
- **Authentication**: JWT-based stateless authentication with automatic token attachment via Axios interceptors.
- **Relational Integrity**: Prisma handles cascading deletes (e.g., deleting a trip automatically cleans up its itinerary, notes, and invoices).

### 5. Monitoring & Observability Stack
The platform is equipped with a professional-grade monitoring stack to ensure high availability and performance:
- **Prometheus**: Acts as the primary metrics store. It scrapes the backend's `/metrics` endpoint every 15 seconds to collect data on HTTP request frequency, status codes, and response latencies.
- **Grafana**: Provides a visual layer for the collected metrics. We use custom dashboards to monitor:
  - **RPS (Requests Per Second)**: Identifying traffic spikes.
  - **Error Rates**: Real-time alerting on 4xx/5xx responses.
  - **System Load**: Monitoring CPU and Memory usage of the Bun runtime.
- **Loki**: Integrated for log aggregation. Instead of manual log inspection, Loki allows us to query and visualize backend logs directly within Grafana, making debugging of production issues significantly faster.
- **Winston & Loki-Transport**: The backend uses a specialized Winston transport to stream structured logs directly to the Loki instance.

### 6. Admin Control Center
A dedicated administrative interface for platform management.
- **Global Oversight**: Admins can view and monitor all trips created on the platform.
- **Analytics & Insights**: Integrated dashboard to track user engagement and platform growth.
- **Privileged Access**: Secured through a combination of frontend route guards and backend role-based middleware, ensuring sensitive data is only accessible to authorized personnel.

## 👥 Contributors

- **SivaSabariGanesan**
- **Kovendhan-B**
- **SriSanjana005**
- **Giri**

## 📄 License

This project is developed for the Traveloop Odoo Hackathon.
