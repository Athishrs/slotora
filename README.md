# Slotora — Appointment Booking Platform

A full-stack, multi-tenant appointment booking platform built to demonstrate production-grade Java and React engineering. Users can discover businesses, book appointments with specific staff members, and manage their bookings — all secured with JWT authentication.

**Live demo:** [https://slotora-steel.vercel.app](https://slotora-steel.vercel.app)

---

## Quick Start (Docker)

The entire stack — frontend, backend, and database — runs with a single command.

**Prerequisites:** Docker Desktop

```bash
git clone https://github.com/Athishrs/slotora
cd slotora
cp .env.example .env
docker-compose up --build
```

Visit `http://localhost` — the app is running.

| Service | URL |
|---|---|
| Frontend (Nginx) | http://localhost |
| Backend API | http://localhost:8080 |
| PostgreSQL | localhost:5433 |

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
- Docker + Docker Compose (local)
- AWS ECS Fargate (backend)
- AWS RDS PostgreSQL (database)
- AWS S3 + CloudFront (frontend)
- AWS ECR (container registry)
- Railway + Vercel (alternate deployment)

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

---

## Local Container Network

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

## AWS Architecture

```
User
  │ HTTPS
  ▼
CloudFront (CDN)
  ├──── S3 Bucket ──────────── React static files (dist/)
  └──── ECS Fargate ─────────── Spring Boot container
              │                       │
              │ pulls image           │ JDBC
              ▼                       ▼
            ECR                  RDS PostgreSQL
        (Docker images)         (slotora database)
```

| Layer | AWS Service | Details |
|---|---|---|
| Frontend CDN | CloudFront | Global edge caching, HTTPS |
| Frontend Storage | S3 | React `dist/` static files |
| Backend Compute | ECS Fargate | Serverless containers, 0.5 vCPU / 1GB RAM |
| Container Registry | ECR | Private Docker image registry |
| Database | RDS PostgreSQL | db.t4g.micro, Single-AZ |

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
- **Multi-platform builds** — `--platform linux/amd64` Docker builds for AWS ECS compatibility from Apple Silicon

---

## API Endpoints

**Public**

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register a new user, returns JWT |
| POST | /api/auth/login | Login, returns JWT |
| GET | /api/services | List all services |
| GET | /api/businesses | List all businesses |

**Protected (JWT required)**

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/bookings | Get current user's bookings |
| POST | /api/bookings | Create a new booking |
| DELETE | /api/bookings/{id} | Cancel a booking |
| GET | /api/users/me | Get current user profile |

---

## Testing

19 tests across three layers — all passing.

| Layer | Class | Tests |
|---|---|---|
| Unit | BookingServiceTest | 7 |
| Integration | AuthControllerIntegrationTest | 6 |
| Integration | BookingControllerIntegrationTest | 6 |

Unit tests use Mockito to isolate `BookingService` from all dependencies — no database, no Spring context. Covers happy paths, slot conflict detection, and ownership validation.

Integration tests spin up a real PostgreSQL container via Testcontainers, boot the full Spring context, and fire HTTP requests through MockMvc with real JWT tokens. Covers the full request lifecycle including security filters, validation, and database persistence.

```bash
# Run all tests (requires Docker Desktop running)
mvn test

# Run unit tests only (no Docker needed)
mvn test -Dtest=BookingServiceTest
```

---

## Running Without Docker

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

For AWS production, all secrets are injected as ECS Task Definition environment variables — never stored in code or committed to Git.

---

## Deployment

| Target | Service | Status |
|---|---|---|
| Backend | Railway | ✅ Live |
| Frontend | Vercel | ✅ Live |
| Backend | AWS ECS Fargate | ✅ Deployed |
| Database | AWS RDS PostgreSQL | ✅ Deployed |
| Frontend CDN | AWS S3 + CloudFront | ✅ Deployed |
| Container Registry | AWS ECR | ✅ Deployed |

### AWS Deployment Steps

```bash
# 1. Build AMD64 image for ECS compatibility (Apple Silicon)
docker buildx build --platform linux/amd64 -t slotora-backend:amd64 ./slotora-backend

# 2. Push to ECR
docker tag slotora-backend:amd64 <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/slotora-backend:latest
docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/slotora-backend:latest

# 3. Build and deploy frontend to S3
cd slotora-frontend
VITE_API_URL=<BACKEND_URL> npm run build
aws s3 sync dist/ s3://slotora-frontend --delete
```
