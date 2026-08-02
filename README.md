# 🌉 FoodBridge — Complete Product & Engineering Architecture

> **A real-time coordination layer connecting food donors, verified NGOs, and volunteers — built to move surplus edible food to the people who need it, before it spoils.**

`Three-Sided Marketplace` · `React JS + Python Django` · `PostgreSQL + PostGIS` · `Redis + Celery` · `WebSockets` · `Production Ready`

---

## 📋 Table of Contents
1. [Project Overview](#01-project-overview)
2. [Key Architecture & System Design](#02-key-architecture--system-design)
3. [User Roles & RBAC Governance](#03-user-roles--rbac-governance)
4. [Core Features Inventory](#04-core-features-inventory)
5. [Tech Stack Matrix](#05-tech-stack-matrix)
6. [Repository Structure](#06-repository-structure)
7. [Testing & Quality Assurance](#07-testing--quality-assurance)
8. [Documentation Index](#08-documentation-index)

---

## 01 · Project Overview

FoodBridge is a three-sided marketplace and real-time coordination layer designed to eliminate the logistical and trust gap between **surplus edible food** and **people facing food insecurity**. It connects three core actors in real time:

```text
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   Food Donors   │ ────► │  Verified NGOs  │ ────► │ Logistics Vol.  │
│ (Hotels/Grocer) │       │ (Shelters/Banks)│       │ (Drivers/Bikes) │
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

- **Donors** — Restaurants, hotels, catering companies, grocery chains, bakeries, and corporate cafeterias with excess edible food.
- **NGOs / Shelters** — Food banks, community kitchens, homeless shelters, orphanages, and disaster relief organizations.
- **Volunteers** — Delivery drivers, bike couriers, and community volunteers providing last-mile pickup and transport.

### The Donation Lifecycle
$$\text{Listed} \longrightarrow \text{Claimed} \longrightarrow \text{Assigned} \longrightarrow \text{Picked Up} \longrightarrow \text{In Transit} \longrightarrow \text{Delivered} \longrightarrow \text{Confirmed}$$

---

## 02 · Key Architecture & System Design

```text
┌──────────────────────────────────────────────────────────┐
│                 React JS Frontend (Vite)                 │
│         (Donor / NGO / Volunteer / Admin / Corporate)    │
└────────────────────────────┬─────────────────────────────┘
                             │ HTTPS REST / WSS WebSockets
┌────────────────────────────▼─────────────────────────────┐
│             Nginx Load Balancer / API Gateway            │
└────────────────────────────┬─────────────────────────────┘
                             │
┌────────────────────────────┼─────────────────────────────┐
│                            │                             │
┌──────────▼──────────┐   ┌──▼──────────┐       ┌──────────▼──────────┐
│  Django REST API    │   │  Django     │       │   Celery Async      │
│  (Business Logic)   │   │  Channels   │       │   Task Workers      │
└──────────┬──────────┘   └──┬──────────┘       └──────────┬──────────┘
           │                 │                             │
┌──────────▼─────────────────▼─────────────────────────────▼──────────┐
│            PostgreSQL + PostGIS (Spatial Database)                  │
│                     Redis (Cache & Pub/Sub)                         │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 03 · User Roles & RBAC Governance

| Role | Key Capabilities | Access Scope |
|---|---|---|
| **Donor** | Create/edit donation listings, set perishability countdown, view impact dashboard. | Own listings & profile |
| **NGO** | Browse nearby map, claim available food listings, submit verification documents, confirm receipt. | Nearby listings & claim history |
| **Volunteer** | View nearby pickup tasks, stream live GPS location, upload delivery proof (photo/OTP). | Assigned & active tasks |
| **Corporate CSR** | Manage multi-branch corporate donors, schedule bulk donations, export ESG reports. | Corporate org umbrella |
| **Admin** | Review NGO/Donor verification queues, mediate disputes, trigger disaster emergency mode, monitor platform telemetry. | Global system control |
| **Super Admin** | Full system control, RBAC permission matrix configuration, database & security management. | Unrestricted root access |

---

## 04 · Core Features Inventory

### 🟢 Core Platform Capabilities
- **Donation Management**: Listing creation, food classification, quantity (kg), perishability window countdown timers, pickup address picker.
- **NGO Document Verification**: 80G tax clearance, state registration document preview modal, manual approve/reject workflows.
- **Commercial Donor Verification**: Food hygiene certification, tax ID verification.
- **Interactive Live Map & GPS Tracking**: Custom SVG markers for Donor Pickup 📍, NGO Delivery 🏢, and moving Volunteer Driver 🛵 with route polylines and speed/ETA HUD.
- **Geospatial Proximity Search**: Radius selector (1km, 5km, 10km, 25km) powered by PostGIS distance calculations.
- **Real-Time WebSockets**: 4 WebSocket channel streams (`/ws/tracking/`, `/ws/notifications/`, `/ws/status/`, `/ws/chat/`).
- **In-App Real-Time Chat**: Direct WebSocket chat room between Donor, NGO, and Volunteer with preset quick-replies.
- **Notification Hub**: Push notifications (FCM), SMS text alerts (Twilio), Email summaries (SendGrid), and unread badge counters.
- **Impact & ESG Analytics**: Quantified metrics for Food Saved (tonnes), Meals Served, Carbon Avoided (CO₂ tonnes), and Water Footprint Saved (liters).
- **Report Exporter**: PDF/CSV report generation for Donations, Volunteers, NGOs, Corporate CSR, and ESG compliance.
- **AI Smart Matching Engine**: Multi-factor candidate scoring based on proximity distance (35%), capacity fit (25%), perishability urgency (20%), and reliability rating (20%).
- **AI Demand Prediction**: Forecasted shelter demand engine predicting district-level food needs.
- **Dispute Resolution & Complaints**: Case mediation queue, evidence inspection, and investigation workflows.
- **Disaster Emergency Mode**: One-click crisis override, city-wide alert broadcasting, and priority routing.
- **Security & Audit Logs**: Immutable audit log stream, OWASP Top 10 compliance, IDOR protection, and RBAC matrix.

---

## 05 · Tech Stack Matrix

| Layer | Primary Technology | Usage & Purpose |
|---|---|---|
| **Frontend Framework** | React JS (Vite + TypeScript) | Responsive 3-sided marketplace web application |
| **State Management** | Redux Toolkit / Zustand | Client-side application state |
| **Styling & System** | Vanilla CSS Tokens + Tailwind | Editorial field-guide visual identity (§14) |
| **Backend Framework** | Python Django 5.0 + DRF | Business logic, authentication, RESTful APIs |
| **Real-Time WebSockets** | Django Channels (ASGI) + Daphne | Live GPS tracking, status sync, real-time chat |
| **Async Task Queue** | Celery + Redis | Notification fan-out, report generation, matching background jobs |
| **Spatial Database** | PostgreSQL + PostGIS Extension | Spatial geospatial radius queries & relational integrity |
| **Caching & Pub/Sub** | Redis | Session cache & WebSocket pub/sub message broker |

---

## 06 · Repository Structure

```text
FoodBridge/
├── foodbridge-backend/         # Django REST API & ASGI WebSockets
│   ├── apps/
│   │   ├── accounts/           # User models, Auth, JWT, OTP
│   │   ├── donors/             # Donor profiles & listings
│   │   ├── ngos/               # NGO profiles & document verification
│   │   ├── volunteers/         # Volunteer fleet profiles
│   │   ├── donations/          # Donation CRUD & lifecycle state machine
│   │   ├── claims/             # NGO claim locking engine
│   │   ├── tasks/              # Volunteer logistics & GPS tracking
│   │   ├── matching/           # AI Smart Matching & recommendation algorithm
│   │   ├── notifications/      # Multi-channel notifications & In-App Chat
│   │   ├── analytics/          # Impact metrics, reports & AI demand forecasting
│   │   ├── admin_panel/        # Admin governance, emergency mode & monitoring
│   │   └── ratings/            # 3-way ratings & review scores
│   ├── config/                 # Settings, ASGI, WSGI, URL routing
│   └── tests/                  # Pytest & DRF APITestCase suites
├── foodbridge-frontend/        # React JS Vite Frontend
│   ├── src/
│   │   ├── api/                # Axios API services
│   │   ├── components/         # Atomic design library (Atoms, Molecules, Organisms)
│   │   ├── hooks/              # Custom hooks (useWebSocket, useGeoLocation, etc.)
│   │   ├── layouts/            # Role layouts (Donor, NGO, Volunteer, Corporate, Admin)
│   │   ├── pages/              # 25+ Application screen pages
│   │   ├── router/             # React Router v6 guarded route definitions
│   │   └── styles/             # CSS design tokens & global stylesheets
│   ├── e2e/                    # Playwright E2E test suite
│   └── cypress/                # Cypress E2E test suite
└── infrastructure/             # Docker Compose, Load Testing & Security
    ├── load_testing/           # Locust load testing suite
    └── security/               # OWASP automated security audit script
```

---

## 07 · Testing & Quality Assurance

FoodBridge includes a production-grade multi-layer testing suite:
- **Backend API & Unit Tests**: Pytest & DRF `APITestCase` testing Auth, Donations, NGOs, Volunteers, Matching, Analytics, Admin, and OWASP Security.
- **Frontend Component Tests**: React Testing Library unit tests.
- **Playwright E2E Tests**: End-to-end multi-browser test suite (`donation-lifecycle.spec.ts`).
- **Cypress E2E Tests**: Cypress end-to-end user navigation suite (`donation_flow.cy.ts`).
- **Locust Load Tests**: High-concurrency performance simulation for 3,500+ users (`locustfile.py`).
- **OWASP Security Audit**: Automated security scanner checking HTTPS headers, CORS, JWT rotation, and injection safety (`security_audit.py`).

---

## 08 · Documentation Index

For detailed guides, refer to:
- 📖 [API Documentation](file:///c:/FoodBridge/API_DOCUMENTATION.md) — Exhaustive REST API reference and WebSocket schemas.
- 🛠 [Installation Guide](file:///c:/FoodBridge/INSTALLATION_GUIDE.md) — Local setup, Docker Compose, PostgreSQL/PostGIS, and Redis installation.
- 🚀 [Production Guide](file:///c:/FoodBridge/PRODUCTION_GUIDE.md) — Enterprise deployment, Kubernetes, AWS/GCP architecture, Nginx, and OWASP security checklist.
