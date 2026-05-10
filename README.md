# Traveloop 🌍

Traveloop is a comprehensive, AI-powered travel planning and management platform designed to streamline your adventures. From initial inspiration to financial itemization, Traveloop handles the heavy lifting of travel logistics.

## 🚀 Features

- **AI Trip Planner**: Leveraging Google's Gemini AI to generate tailored itineraries based on your preferences.
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

### 5. Observability
Equipped with a Prometheus metrics exporter, the backend monitors request duration, error rates, and throughput, allowing for Grafana visualization and performance bottleneck identification.

## 👥 Contributors

- **SivaSabariGanesan**
- **Kovendhan-B**
- **SriSanjana005**
- **Giri**

## 📄 License

This project is developed for the Traveloop Odoo Hackathon.
