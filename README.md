# Slotora — Appointment Booking Platform

A full-stack, multi-tenant appointment booking platform built to demonstrate production-grade Java and React engineering. Users can discover businesses, book appointments with specific staff members, and manage their bookings — all secured with JWT authentication.

> **Live demo:** _coming soon_

---

## Quick Start (Docker)

The entire stack — frontend, backend, and database — runs with a single command.

**Prerequisites:** Docker Desktop

```bash
git clone https://github.com/Athishrs/slotora
cd slotora

# Create a .env file in the root
cp .env.example .env

docker-compose up --build
```

Visit **http://localhost** — the app is running.

| Service | URL |
|---------|-----|
| Frontend (Nginx) | http://localhost |
| Backend API | http://localhost:8080 |
| PostgreSQL | localhost:5433 |

To stop:
```bash
docker-compose down
```

---

## Tech Stack

**Backend**
- Java 21, Spring Boot 3.5
- Spring Security + JWT (jjwt 0.12)
- Spring Data JPA + Hibernate
- PostgreSQL 16
- Maven

**Frontend**
- React 18 + Vite
- Tailwind CSS v3
- React Router, Axios, React Context API
- Nginx (production static file server)

**Infrastructure**
- Docker + Docker Compose
- Multi-stage builds (Maven → JRE, Node → Nginx)

**Testing**
- JUnit 5 + Mockito (unit tests)
- Testcontainers + PostgreSQL (integration tests)
- Spring MockMvc

---

## Architecture

```
slotora/
├── docker-compose.yml          # Orchestrates all 3 containers
├── .env                        # JWT secrets (never committed)
├── slotora-backend/            # Spring Boot REST API
│   ├── Dockerfile              # Multi-stage: Maven build → Corretto 21 JRE
│   ├── controller/             # AuthController, BookingController, etc.
│   ├── service/                # Business logic layer
│   ├── repository/             # Spring Data JPA repositories
│   ├── entity/                 # User, Business, Service, Staff, Booking
│   ├── dto/                    # Request/Response DTOs
│   ├── security/               # JwtAuthFilter, SecurityConfig
│   ├── exception/              # Custom exceptions
│   └── handler/                # GlobalExceptionHandler
└── slotora-frontend/           # React + Vite SPA
    ├── Dockerfile              # Multi-stage: Node build → Nginx
    ├── nginx.conf              # SPA routing + /api proxy to backend
    ├── pages/                  # Landing, Login, Register, Dashboard,
    │                           # MyBookings, NewBooking, BusinessOwnerPage
    ├── context/                # AuthContext (JWT + user state)
    └── api/                    # Axios instance with JWT interceptor
```

### Container Network

```
http://localhost
      ↓
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  slotora_       │────▶│  slotora_        │────▶│  slotora_db     │
│  frontend       │     │  backend         │     │  PostgreSQL 16  │
│  Nginx :80      │     │  Spring Boot     │     │  :5432          │
└─────────────────┘     │  :8080           │     └─────────────────┘
                        └──────────────────┘
```

---

## Key Features

- **JWT Authentication** — stateless auth with token-based sessions; filter validates every protected request
- **Multi-step booking flow** — users select a service, pick a staff member, and choose a time slot
- **Slot conflict detection** — prevents double-booking the same staff member at the same time
- **Business owner dashboard** — multi-step wizard for managing services and staff
- **Role-aware API** — protected endpoints extract the authenticated user via `@AuthenticationPrincipal`
- **Global exception handling** — consistent JSON error responses across all endpoints
- **Data seeding** — `DataSeeder` populates businesses, services, and staff on startup
- **Dockerized** — full stack runs in isolated containers; no local Postgres or Java install required

---

## API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user, returns JWT |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/services` | List all services |
| GET | `/api/businesses` | List all businesses |

### Protected (JWT required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings` | Get current user's bookings |
| POST | `/api/bookings` | Create a new booking |
| DELETE | `/api/bookings/{id}` | Cancel a booking |
| GET | `/api/users/me` | Get current user profile |

---

## Testing

19 tests across three layers — all passing.

| Layer | Class | Tests |
|-------|-------|-------|
| Unit | `BookingServiceTest` | 7 |
| Integration | `AuthControllerIntegrationTest` | 6 |
| Integration | `BookingControllerIntegrationTest` | 6 |

**Unit tests** use Mockito to isolate `BookingService` from all dependencies — no database, no Spring context. Covers happy paths, slot conflict detection, and ownership validation.

**Integration tests** spin up a real PostgreSQL container via Testcontainers, boot the full Spring context, and fire HTTP requests through MockMvc with real JWT tokens. Covers the full request lifecycle including security filters, validation, and database persistence.

```bash
# Run all tests (requires Docker Desktop running)
mvn test

# Run unit tests only (no Docker needed)
mvn test -Dtest=BookingServiceTest
```

---

## Running Without Docker

If you prefer to run services individually:

**Prerequisites:** Java 21, Node.js 18+, PostgreSQL running locally

**Backend**
```bash
cd slotora-backend
export JWT_SECRET=your-secret-key-here
export JWT_EXPIRATION=86400000
mvn spring-boot:run
# API runs on http://localhost:8080
```

**Frontend**
```bash
cd slotora-frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

**Database**

Create a local Postgres database named `slotora`. Hibernate will auto-create all tables on first run (`ddl-auto=update`).

---

## Environment Variables

Create a `.env` file in the project root:

```env
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=86400000
```

Never commit this file. It is listed in `.gitignore`.

---

## Deployment

| Target | Service | Status |
|--------|---------|--------|
| Backend | Railway | 🔜 In progress |
| Frontend | Vercel | 🔜 In progress |
| Backend (alt) | AWS Elastic Beanstalk | 📋 Planned |
| Database (alt) | AWS RDS (PostgreSQL) | 📋 Planned |
| CDN (alt) | AWS S3 + CloudFront | 📋 Planned |

---

